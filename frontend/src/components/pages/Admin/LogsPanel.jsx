import { Box, Card, CardContent, Stack, Typography, Pagination } from '@mui/material'
import React, { useEffect, useState } from 'react'
import api from '../../../api/api';
import { useAuth } from '../../shared/AuthProvider/useAuth';

function LogsPanel() {
  const { user } = useAuth();
  const [logs, setLogs] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const logsPerPage = 20;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) {
        setLogs(() => null);
        setTotalCount(() => 0);
        return;
      }

      try {
        const startIndex = (page - 1) * logsPerPage;
        const endIndex = page * logsPerPage;

        const res = await api.get(`/user/logs/${startIndex}/${endIndex}`);
        setLogs(() => res.data.logs);
        setTotalCount(() => res.data.totalCount);
      } catch (err) {
        alert(err.response?.message || "Failed to fetch logs");
        setLogs(() => null);
        setTotalCount(0);
      }
    };

    fetchLogs();

  }, [user, page]);

  const pageCount = Math.ceil(totalCount / logsPerPage);

  return (
    <Box>
      <Stack gap={2}>
        <Typography component="h2" variant="h4">
          Logs
        </Typography>

        {logs ? (
          <Box>
            {logs.map((log) => (
              <Card key={log._id}>
                <CardContent>
                  <Typography component="h3" variant="h5">
                    {log.header}
                  </Typography>
                  <Typography component="p" variant="h6">
                    {new Date(log.createdAt).toLocaleString()}
                  </Typography>
                  <Typography component="p" variant="body1">
                    {log.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}

            {pageCount > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                />
              </Box>
            )}
          </Box>) : (
          <Typography component="h3" variant="h5">
            There isn't any log!
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default LogsPanel;
