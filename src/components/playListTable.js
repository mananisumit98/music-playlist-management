import { Card } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React from 'react'

const PlayListTable = ({ data, columns, type }) => {
    return (
        <Card style={{ marginTop: "10px 0" }}>
            <DataGrid
                className="project-list"
                autoHeight
                rows={data}
                columns={columns}
                getRowId={(row) => type === "playlist" ? row._id : type === "songs" ? row._id : row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        csvOptions: { disableToolbarButton: true },
                        printOptions: { disableToolbarButton: true },
                    },
                }}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 20, 30]}
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                localeText={{ noRowsLabel: "No data", footerRowSelected: count => '' }}
                sx={{
                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                        outline: "none",
                    },
                    "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
                    {
                        outline: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-toolbarQuickFilter": {
                        margin: "10px 10px 10px 0"
                    },
                }}
                search={false}
            />
        </Card>
    )
}

export default PlayListTable;