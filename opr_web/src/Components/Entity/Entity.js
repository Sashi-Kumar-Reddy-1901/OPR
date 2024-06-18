import React, { useEffect, useState, useMemo, useRef } from "react";
import axiosInstance from "../../api/axios";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, useGridApiRef, GridToolbar,gridClasses } from "@mui/x-data-grid";
import "./Entitty.css";
import { useDispatch, useSelector } from 'react-redux';
import { resetMethodCall } from "../../Redux-Slices/getEntitySlice";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { IconButton } from "@mui/material";

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
        // Reset on touch devices, it doesn't add specificity
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


const Entity = () => {
  const apiRef = useGridApiRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const dispatch = useDispatch();
  const shouldCallMethod = useSelector((state) => state.method.shouldCallMethod);
  const [headerName, setheaderName] = useState({"auth_remarks": "Auth Remarks","checker_time": "Checker"});

  const columns = [
    { field: "authRemarks", headerName: headerName.authRemarks, width: 130 , headerClassName: 'header-theme'},
    { field: "emailid", headerName: headerName.emailid, width: 130, headerClassName: 'header-theme' },
    { field: "ulevel", headerName: headerName.ulevel, width: 130, headerClassName: 'header-theme' },
    { field: "unitName", headerName: headerName.unitName, width: 130, headerClassName: 'header-theme' },
    { field: "entityStatus", headerName: headerName.entityStatus, width: 130, headerClassName: 'header-theme' },
    { field: "entityType", headerName: headerName.entityType, width: 130, headerClassName: 'header-theme' },
    { field: "checker", headerName: headerName.checker, width: 130, headerClassName: 'header-theme' },
    { field: "checkerTime", headerName: headerName.checkerTime, width: 130, headerClassName: 'header-theme' },
    { field: "maker", headerName: headerName.maker, width: 130, headerClassName: 'header-theme' },
    { field: "makerTime", headerName: headerName.makerTime, width: 130, headerClassName: 'header-theme' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      let searchT = "";
      console.log(filterModel.quickFilterValues);
      if (filterModel.quickFilterValues) {
        searchT = filterModel.quickFilterValues.toString();
      }
      const sort =
        sortModel.length > 0
          ? sortModel.map((sort) => ({ field: sort.field, order: sort.sort }))
          : [{ field: "ulevel", order: "asc" },{ field: "emailid", order: "asc" }];
      const response = await axiosInstance.post("/entity/get_entities", {
        pagination: {
          pageSize: paginationModel.pageSize,
          pageNo: paginationModel.page + 1,
        },
        search: {
          fields: [ "emailid"],
          keyword: searchT,
        },

        sort: sort,
      });  
      const resData = response.data?.data?.data?.entityDTOList;
      let length;
      length = response.data?.data?.data?.entityDTOList?.length;
      const totalRecords = response.data?.data?.data?.totalRecords;
      const columnHeader = response.data?.data?.data?.columnnHeadersForEntities;
      console.log("columnHeader",columnHeader);
      setheaderName(columnHeader);
      console.log("totalreco",response.data?.data?.data?.totalRecords);
      console.log("length", length);
      console.log("resDaya", resData);
      setData(resData);
      setRowCount(totalRecords);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldCallMethod) {
      console.log('Method in Component2 called');
      // Perform some actions here
      dispatch(resetMethodCall()); // Reset the call state
    }
    fetchData();
  }, [paginationModel, sortModel, filterModel,shouldCallMethod,dispatch]);

  const paginationMetaRef = useRef();
  const paginationMeta = useMemo(() => {
    const hasNextPage = data.length === paginationModel.pageSize;
    if (paginationMetaRef.current?.hasNextPage !== hasNextPage) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [data]);

  return (
    <>
      <div style={{ width: "100%", marginTop: "50px" }}>
        <div className="sectionHeader"></div>
        <div className="mt-2" style={{ height: "72vh" }}>
          <StripedDataGrid
            apiRef={apiRef}
            rows={data}
             getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
            columns={columns}
            getRowId={(row) => `${row.ucode}_${row.checkerTime}`}
            loading={loading}
            pagination
            paginationMode="server"
            pageSizeOptions={[5, 10, 25, 50]}
            paginationModel={paginationModel}
            paginationMeta={paginationMeta}
            onPaginationModelChange={setPaginationModel}
            sortingMode="server"
            sortModel={sortModel}
            rowCount={rowCount}
            onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
            filterMode="server"
            filterModel={filterModel}
            onFilterModelChange={(newFilterModel) =>
              setFilterModel(newFilterModel)
            }
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            initialState={{
              density: "compact",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Entity;
