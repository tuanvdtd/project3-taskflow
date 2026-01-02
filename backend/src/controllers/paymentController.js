import { StatusCodes } from 'http-status-codes'
import {
  VNPay,
  ignoreLogger,
  ProductCode,
  IpnFailChecksum,
  IpnOrderNotFound,
  InpOrderAlreadyConfirmed,
  IpnUnknownError,
  IpnSuccess,
  dateFormat
} from 'vnpay'

import { paymentService } from '~/services/paymentService'

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE,
  secureSecret: process.env.VNPAY_SECRET_KEY,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
  hashAlgorithm: 'SHA512', // tùy chọn

  /**
   * Bật/tắt ghi log
   * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
   */
  enableLog: true, // tùy chọn

  /**
   * Hàm `loggerFn` sẽ được gọi để ghi log khi enableLog là true
   * Mặc định, loggerFn sẽ ghi log ra console
   * Bạn có thể cung cấp một hàm khác nếu muốn ghi log vào nơi khác
   *
   * `ignoreLogger` là một hàm không làm gì cả
   */
  loggerFn: ignoreLogger, // tùy chọn

  /**
   * Tùy chỉnh các đường dẫn API của VNPay
   * Thường không cần thay đổi trừ khi:
   * - VNPay cập nhật đường dẫn của họ
   * - Có sự khác biệt giữa môi trường sandbox và production
   */
  endpoints: {
    paymentEndpoint: 'paymentv2/vpcpay.html',
    queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list'
  } // tùy chọn
})

export const createPaymentUrl = async (req, res) => {
  try {
    const userId = req.jwtDecoded._id
    // Tạo đơn hàng
    const order = await paymentService.createPayment({
      userId: userId,
      planCode: req.body.planCode,
      paymentProvider: 'vnpay',
      amount: req.body.amount,
      billingCycle: req.body.billingCycle
    })

    // Order
    // console.log('Order:', order)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Nếu là thanh toán VNPay
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: order.amount, // Số tiền thanh toán
      vnp_IpAddr: req.ip,
      vnp_TxnRef: `${order._id}`, // Mã đơn hàng, trong thực tế cần đảm bảo tính duy nhất
      vnp_OrderInfo: `Thanh toan don hang-${order._id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl:
        'http://localhost:5173/vnpay-return', // Frontend - Thay sau
      vnp_Locale: 'vn',
      vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
      vnp_ExpireDate: dateFormat(tomorrow) // tùy chọn
    })

    return res.status(StatusCodes.OK).json({
      success: true,
      paymentUrl
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo đơn hàng',
      error: error.message
    })
  }
}

// Đoạn này xử lý với backend
export const vnpayIPN = async (req, res) => {
  try {
    // console.log(req.query)
    // console.log('Nhận IPN từ VNPay:', req.query)

    const verify = vnpay.verifyIpnCall(req.query)
    // console.log('Kết quả verify:', verify)

    if (!verify.isVerified) {
      // console.log('Sai checksum')
      return res.json(IpnFailChecksum)
    }

    if (!verify.isSuccess) {
      // console.log('Giao dịch không thành công từ VNPay')
      return res.json(IpnUnknownError)
    }

    //Tìm trong cơ sở dữ liệu
    const foundOrder = await paymentService.findPaymentById(verify.vnp_TxnRef)
    // console.log('Đơn hàng tìm thấy:', foundOrder)

    if (!foundOrder) {
      // console.log('Không tìm thấy đơn hàng')
      return res.json(IpnOrderNotFound)
    }

    if (verify.vnp_TxnRef !== foundOrder._id.toString()) {
      // console.log(
      //   'Mã đơn hàng không khớp. Gửi:',
      //   verify.vnp_TxnRef,
      //   ' DB:',
      //   foundOrder._id.toString()
      // )
      return res.json(IpnOrderNotFound)
    }


    if (foundOrder.status === 'active') {
      // console.log('Đơn hàng đã được xác nhận từ trước')
      return res.json(InpOrderAlreadyConfirmed)
    }

    // Cập nhật trạng thái đơn hàng
    await paymentService.updatePaymentStatus({
      subscriptionId: foundOrder._id.toString(),
      status: 'active'
    })

    // console.log('Cập nhật đơn hàng thành công:', foundOrder._id.toString())

    return res.json(IpnSuccess)
  } catch (error) {
    // console.error('Lỗi xảy ra trong xử lý IPN:', error)
    return res.json(IpnUnknownError)
  }
}

// Return khi client tiến hành thanh toán xong (Bất kể kết quả)
// Cái này sẽ sửa đổi sau, FE thiết kế một giao diện hiển thị
export const vnpayReturn = async (req, res) => {
  let verify
  let status = 'fail'
  let message = 'Dữ liệu không hợp lệ'
  let orderId = ''

  try {
    verify = vnpay.verifyReturnUrl(req.query)

    if (!verify.isVerified) {
      message = 'Xác thực chữ ký không hợp lệ'
    } else if (!verify.isSuccess) {
      message = 'Thanh toán thất bại'
      orderId = verify.vnp_TxnRef
    } else {
      status = 'success'
      message = 'Thanh toán thành công!'
      orderId = verify.vnp_TxnRef
    }
  } catch (error) {
    message = 'Đã xảy ra lỗi khi xử lý dữ liệu thanh toán'
  }
  return res.status(StatusCodes.OK).json({
    status,
    message,
    orderId
  })

}