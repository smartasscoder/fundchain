import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Campaign,
  People,
  AttachMoney,
  Timeline,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  // Mock data for MVP
  const stats = [
    {
      title: 'Total Funds Raised',
      value: '$2,450,000',
      icon: <AttachMoney color="primary" />,
      change: '+12.5%',
      changeColor: 'success.main',
    },
    {
      title: 'Active Campaigns',
      value: '24',
      icon: <Campaign color="primary" />,
      change: '+3',
      changeColor: 'info.main',
    },
    {
      title: 'Total Users',
      value: '1,234',
      icon: <People color="primary" />,
      change: '+8.2%',
      changeColor: 'success.main',
    },
    {
      title: 'Success Rate',
      value: '87%',
      icon: <TrendingUp color="primary" />,
      change: '+2.1%',
      changeColor: 'success.main',
    },
  ];

  const recentTransactions = [
    { id: 1, campaign: 'EcoTech Startup', amount: '$50,000', status: 'Completed' },
    { id: 2, campaign: 'HealthTech Innovation', amount: '$75,000', status: 'Pending' },
    { id: 3, campaign: 'Green Energy Project', amount: '$120,000', status: 'Completed' },
    { id: 4, campaign: 'AI Research Fund', amount: '$90,000', status: 'In Progress' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: stat.changeColor, fontWeight: 'bold' }}
                    >
                      {stat.change} from last month
                    </Typography>
                  </Box>
                  <Box sx={{ fontSize: 40 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity and Quick Actions */}
      <Grid container spacing={3}>
        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <List>
              {recentTransactions.map((transaction) => (
                <ListItem key={transaction.id} divider>
                  <ListItemIcon>
                    <AccountBalance />
                  </ListItemIcon>
                  <ListItemText
                    primary={transaction.campaign}
                    secondary={`${transaction.amount} - ${transaction.status}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <Campaign />
                </ListItemIcon>
                <ListItemText primary="Create New Campaign" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="Invite Users" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <Timeline />
                </ListItemIcon>
                <ListItemText primary="View Analytics" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
