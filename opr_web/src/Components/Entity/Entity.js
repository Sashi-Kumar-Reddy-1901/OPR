import React, { useEffect, useState, useMemo, useRef } from 'react';
import axiosInstance from "../../api/axios"; 
import { DataGrid, useGridApiRef ,GridToolbar} from "@mui/x-data-grid";

const Entity = () => {
  const apiRef = useGridApiRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const columns = [
    { field: "authRemarks", headerName: "Auth Remarks", width: 130 },
    { field: "checker", headerName: "Checker", width: 130 },
    { field: "checkerTime", headerName: "Checker Time", width: 130 },
    { field: "emailid", headerName: "Email Id", width: 130 },
    { field: "ulevel", headerName: "ULevel", width: 130 },
    { field: "entityStatus", headerName: "Entity Status", width: 130 },
    { field: "entityType", headerName: "EntityType", width: 130 },
    { field: "leCode", headerName: "LeCode", width: 130 },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      let searchT = "";
      console.log(filterModel.quickFilterValues);
      if(filterModel.quickFilterValues){
         searchT =  (filterModel.quickFilterValues).toString() ;
      }
     
      const sort = sortModel.length > 0 ? sortModel.map((sort) => ({ field: sort.field, order: sort.sort })) : [{ field: "ulevel", order: "asc" }];
      const response = await axiosInstance.post('/entity/get_entities', {
        "pagination": {
          "pageSize": paginationModel.pageSize,
          "pageNo": paginationModel.page + 1
        },
        "search": {
          "fields": ["unit_name", "ucode","emailid"],
          "keyword": searchT
        },
   
        "sort" : sort
      });
      const resData = response.data?.data?.data;
      const length = (response.data?.data?.data).length;
      console.log("length", length)
      setData(resData);
      setRowCount(100);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel, sortModel, filterModel]);

  const paginationMetaRef = useRef();

  const paginationMeta = useMemo(() => {
    const hasNextPage = data.length === paginationModel.pageSize;
    if (paginationMetaRef.current?.hasNextPage !== hasNextPage) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [data]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    console.log(searchText);
    fetchData();
  };

  return (
    <div style={{  height: "82vh", width: "100%" ,marginTop :"35px"}}>
      <DataGrid
        apiRef={apiRef}
        rows={data}
        columns={columns}
        getRowId={(row) =>  `${row.ucode}_${row.checkerTime}`}
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
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
        // components={{ Toolbar: GridToolbar }}
        // componentsProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //     quickFilterProps: { debounceMs: 500 },
        //     onQuickFilterChange: handleSearchChange
        //   },
        // }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        initialState={{
          density: 'compact',
        }}
      />
    </div>
  );
}

export default Entity;

// import React, { useEffect, useState, useMemo } from 'react';
// import Box from '@mui/material/Box';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import axiosInstance from "../../api/axiosInstance"; 

// const VISIBLE_FIELDS = ['authRemarks', 'checker', 'checkerTime', 'emailid', 'ulevel', 'entityStatus', 'entityType', 'leCode'];

// const Entity = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [sortModel, setSortModel] = useState([]);
//   const [filterModel, setFilterModel] = useState({ items: [] });
//   const [rowCount, setRowCount] = useState(0);
//   const [searchText, setSearchText] = useState('');
//   const token = sessionStorage.getItem("token");

//   const columns = [
//     { field: "authRemarks", headerName: "Auth Remarks", width: 130 },
//     { field: "checker", headerName: "Checker", width: 130 },
//     { field: "checkerTime", headerName: "Checker Time", width: 130 },
//     { field: "emailid", headerName: "Email Id", width: 130 },
//     { field: "ulevel", headerName: "ULevel", width: 130 },
//     { field: "entityStatus", headerName: "Entity Status", width: 130 },
//     { field: "entityType", headerName: "EntityType", width: 130 },
//     { field: "leCode", headerName: "LeCode", width: 130 },
//   ];

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const sort = sortModel.length > 0 ? sortModel.map((sort) => ({ field: sort.field, order: sort.sort })) : [{ field: "ulevel", order: "asc" }];
//       const response = await axiosInstance.post('/entity/get_entities', {
//         "pagination": {
//           "pageSize": pageSize,
//           "pageNo": page + 1 
//         },
//         "search": {
//           "fields":  ["unit_name", "ucode"],
//           "keyword": searchText
//         },
//         "sort": sort
//       }, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         }
//       });
//       const resData = response.data?.data?.data;
//       const totalCount = response.data?.data?.total; // Adjust this according to your actual response structure
//       setData(resData);
//       setRowCount(30);
//     } catch (error) {
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [token, page, pageSize, sortModel, filterModel, searchText]);

//   const handleSearchChange = (event) => {
//     setSearchText(event.target.value);
//   };

//   return (
//     <>
//       <Box sx={{ height: 400, width: '100%' }}>
//         <DataGrid
//           rows={data}
//           columns={columns}
//           getRowId={(row) => row.ucode}
//           loading={loading}
//           pagination
//           pageSize={pageSize}
//           onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
//           rowsPerPageOptions={[5, 10]}
//           pageSizeOptions={[5, 10, 25, 50]}
//           paginationMode="server"
//           rowCount={rowCount}
//           onPageChange={(newPage) => setPage(newPage)}
//           sortingMode="server"
//           sortModel={sortModel}
//           onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
//           filterMode="server"
//           filterModel={filterModel}
//           onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
//           components={{ Toolbar: GridToolbar }}
//           componentsProps={{
//             toolbar: {
//               showQuickFilter: true,
//               quickFilterProps: { debounceMs: 500 },
//               onQuickFilterChange: handleSearchChange
//             },
//           }}
//         />
//       </Box>
//     </>
//   );
// }

// export default Entity;
