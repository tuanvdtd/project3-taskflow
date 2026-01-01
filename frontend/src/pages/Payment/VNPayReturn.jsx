import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'

const VNPayReturn = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // url
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode')
    const vnp_Amount = searchParams.get('vnp_Amount')
    const vnp_BankCode = searchParams.get('vnp_BankCode')
    const vnp_BankTranNo = searchParams.get('vnp_BankTranNo')
    const vnp_CardType = searchParams.get('vnp_CardType')
    const vnp_OrderInfo = searchParams.get('vnp_OrderInfo')
    const vnp_PayDate = searchParams.get('vnp_PayDate')
    const vnp_TransactionNo = searchParams.get('vnp_TransactionNo')
    const vnp_TransactionStatus = searchParams.get('vnp_TransactionStatus')
    const vnp_TxnRef = searchParams.get('vnp_TxnRef')

    // Format payment date
    const formatPaymentDate = (dateStr) => {
      if (!dateStr) return 'N/A'
      // Format: YYYYMMDDHHmmss -> DD/MM/YYYY HH:mm:ss
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      const hour = dateStr.substring(8, 10)
      const minute = dateStr.substring(10, 12)
      const second = dateStr.substring(12, 14)
      return `${day}/${month}/${year} ${hour}:${minute}:${second}`
    }

    // Format amount (VNPay amount is in smallest unit, multiply by 100)
    const formatAmount = (amount) => {
      if (!amount) return '0'
      const numAmount = parseInt(amount) / 100
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(numAmount)
    }

    setPaymentInfo({
      isSuccess: vnp_ResponseCode === '00' && vnp_TransactionStatus === '00',
      responseCode: vnp_ResponseCode,
      amount: formatAmount(vnp_Amount),
      bankCode: vnp_BankCode,
      bankTranNo: vnp_BankTranNo,
      cardType: vnp_CardType,
      orderInfo: vnp_OrderInfo,
      payDate: formatPaymentDate(vnp_PayDate),
      transactionNo: vnp_TransactionNo,
      transactionStatus: vnp_TransactionStatus,
      txnRef: vnp_TxnRef
    })

    setLoading(false)
  }, [searchParams])

  const handleGoHome = () => {
    navigate('/boards')
  }


  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 8,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          {/* Icon and Status */}
          <Box sx={{ mb: 3 }}>
            {paymentInfo?.isSuccess ? (
              <>
                <CheckCircleIcon
                  sx={{
                    fontSize: 80,
                    color: 'success.main',
                    mb: 2
                  }}
                />
                <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
                  Thanh Toán Thành Công!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Giao dịch của bạn đã được xử lý thành công
                </Typography>
              </>
            ) : (
              <>
                <ErrorIcon
                  sx={{
                    fontSize: 80,
                    color: 'error.main',
                    mb: 2
                  }}
                />
                <Typography variant="h4" fontWeight="bold" color="error.main" gutterBottom>
                  Thanh Toán Thất Bại
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Đã có lỗi xảy ra trong quá trình thanh toán
                </Typography>
              </>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Transaction Details */}
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReceiptLongIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Chi Tiết Giao Dịch
              </Typography>
            </Box>

            {paymentInfo && (
              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Số tiền:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary.main">
                    {paymentInfo.amount}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mã giao dịch:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {paymentInfo.transactionNo}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mã đơn hàng:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {paymentInfo.txnRef}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ngân hàng:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {paymentInfo.bankCode} ({paymentInfo.cardType})
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mã giao dịch ngân hàng:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {paymentInfo.bankTranNo}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Thời gian:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {paymentInfo.payDate}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Nội dung:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {paymentInfo.orderInfo}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Success Message */}
          {paymentInfo?.isSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Gói premium của bạn đã được kích hoạt!
            </Alert>
          )}

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Về Trang Chủ
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default VNPayReturn
