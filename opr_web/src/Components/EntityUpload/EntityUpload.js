import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import CustomHeaderUpload from './CustomHeaderUpload';
import { DataGrid, useGridApiRef, gridClasses } from "@mui/x-data-grid";
import { alpha, styled } from '@mui/material/styles';

const ODD_OPACITY = 0.1;
 
const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
          theme.palette.action.selectedOpacity +
          theme.palette.action.hoverOpacity,
        ),
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));

const EntityUpload = () => {
  const [rowCount, setRowCount] = useState(0);

  const columns = [
    { field: "fileName", headerName: "FileName", width: 130, headerClassName: 'header-theme' },
  ]


  return (
    <>
    <div style={{ width: "100%", marginTop: "50px" }}>
        <CustomHeaderUpload />
        <div>

        </div>
    </div>
    </>
  )
}

export default EntityUpload