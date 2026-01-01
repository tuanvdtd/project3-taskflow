import React from 'react'
import Box from '@mui/material/Box'
import TaskFlowCard from './TaskFlowCard'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

function ListCard({ cards }) {
  return (
    <>
      <SortableContext
        items={cards?.map((c) => c._id)}
        strategy={verticalListSortingStrategy}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: '0 5px 5px 5px',
            m: '0 5px',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: (theme) =>
              `calc(${theme.TaskFlow.boardContentHeight} - ${theme.spacing(
                5
              )} - ${theme.TaskFlow.columnHeaderHeight} - ${
                theme.TaskFlow.columnFooterHeight
              })`,
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#ced0da'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#bfc2cf'
            }
          }}
        >
          {cards.map((card) => {
            return <TaskFlowCard key={card?._id} card={card} />
          })}
        </Box>
      </SortableContext>
    </>
  )
}

export default ListCard
