import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Card, CardContent, 
  Pagination, Box, AppBar, Toolbar, Chip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface NotificationItem {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event' | string;
  Message: string;
  Timestamp: string;
}

// Complete mock dataset matching the evaluation service schema format
const MOCK_DATA: NotificationItem[] = [
  { ID: "1", Type: "Placement", Message: "Microsoft recruitment drive registration closes tonight at 11:59 PM. Ensure your profiles are updated.", Timestamp: "2026-06-23 10:30 AM" },
  { ID: "2", Type: "Result", Message: "End Semester results for Third Year CSD have been published on the official campus management portal.", Timestamp: "2026-06-23 09:15 AM" },
  { ID: "3", Type: "Event", Message: "Annual National Level Hackathon 'AffordMed Hack 2026' scheduled for this weekend. Register at the seminar hall.", Timestamp: "2026-06-22 04:00 PM" },
  { ID: "4", Type: "Placement", Message: "Amazon off-campus internship results are out. Shortlisted candidates check your registered student inbox.", Timestamp: "2026-06-22 02:00 PM" },
  { ID: "5", Type: "Event", Message: "Guest lecture on Advanced Cloud Architectures by industry experts tomorrow at 10:00 AM in Audi-2.", Timestamp: "2026-06-22 11:00 AM" },
  { ID: "6", Type: "Result", Message: "Supplementary examination schedule for regular and supply batches has been uploaded to the notice board.", Timestamp: "2026-06-21 03:45 PM" },
  { ID: "7", Type: "Placement", Message: "Cognizant Technology Solutions onboarding documentation link is active for selected students.", Timestamp: "2026-06-21 01:20 PM" },
  { ID: "8", Type: "Event", Message: "Inter-college sports meet team selections start tomorrow at 6:00 AM on the main sports ground.", Timestamp: "2026-06-20 05:00 PM" }
];

function App() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [readLogs, setReadLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('read_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const limit = 3; // Kept at 3 to cleanly display pagination items across pages

  useEffect(() => {
    // Client-side simulation of the server filtering and pagination parameters
    let filtered = [...MOCK_DATA];
    if (filterType) {
      filtered = filtered.filter(item => item.Type === filterType);
    }

    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);
    
    setNotifications(paginatedItems);
  }, [page, filterType]);

  const handleMarkAsRead = (id: string) => {
    const updatedReadLogs = [...readLogs, id];
    setReadLogs(updatedReadLogs);
    localStorage.setItem('read_notifications', JSON.stringify(updatedReadLogs));
  };

  const getPriorityColor = (type: string): "error" | "warning" | "info" | "default" => {
    if (type === 'Placement') return 'error'; 
    if (type === 'Result') return 'warning';   
    if (type === 'Event') return 'info';
    return 'default';                             
  };

  // Dynamically calculate total pagination pages based on current selections
  const filteredCount = filterType ? MOCK_DATA.filter(item => item.Type === filterType).length : MOCK_DATA.length;
  const totalPages = Math.ceil(filteredCount / limit) || 1;

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Campus Priority Notifications Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Card sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <label 
                htmlFor="filter-select" 
                style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  color: '#666', 
                  marginBottom: '6px', 
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500
                }}
              >
                Filter by Category
              </label>
              <select
                id="filter-select"
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  borderColor: '#ccc',
                  fontSize: '15px',
                  fontFamily: 'Roboto, sans-serif',
                  backgroundColor: '#fff',
                  cursor: 'pointer'
                }}
              >
                <option value="">Show All Classes</option>
                <option value="Placement">Placement Notifications</option>
                <option value="Result">Exam Results</option>
                <option value="Event">Campus Events</option>
              </select>
            </Box>
          </Box>
        </Card>

        <Box sx={{ minHeight: '400px' }}>
          {notifications.map((item) => {
            const isRead = readLogs.includes(item.ID);
            return (
              <Card 
                key={item.ID} 
                sx={{ 
                  mb: 2, 
                  opacity: isRead ? 0.65 : 1, 
                  borderLeft: 6, 
                  borderColor: `${getPriorityColor(item.Type)}.main` 
                }}
              >
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ pr: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                      <Chip label={item.Type} size="small" color={getPriorityColor(item.Type)} />
                      {isRead ? (
                        <Chip label="Read" size="small" variant="outlined" />
                      ) : (
                        <Chip label="New!" size="small" color="success" variant="filled" />
                      )}
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: isRead ? 'normal' : 'bold', mb: 0.5 }}>
                      {item.Message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Received at: {item.Timestamp}
                    </Typography>
                  </Box>
                  {!isRead && (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      color="primary"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleMarkAsRead(item.ID)}
                      sx={{ minWidth: '110px', flexShrink: 0 }}
                    >
                      Mark Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(event, value) => setPage(value)} 
            color="primary" 
          />
        </Box>
      </Container>
    </Box>
  );
}

export default App;