import React from 'react'
// import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Grid, TextField, Button } from '@material-ui/core'


const UserDetails = ({ nextStep, handleChange, values }) => {
  
    // for continue event listener
    const Continue = e => {
      e.preventDefault();
      nextStep();
    }
  
    return (
      <Container  component="main" maxWidth="xs">
        <div>
        <div> Selling with Khmer furniture is free and easy. We look for furniture that meets our standards for quality and durability.
          After your pickup, we’ll email you an instant offer </div>
          <br/> 
          <div> Accept it, and you can cash out immediately without waiting for your items to sell.
           Decline or ignore your offer and you’ll earn a revenue share post-sale instead.</div>
           <br/> 
          <Typography  component="h1" variant="h5" className='content-center bold'> 
           Item info
          </Typography>
          <form>
            <Grid container spacing={2}>
                {/* Category */}
                <Grid item xs={12}>
                  <TextField 
                    placeholder="Category type"
                    label="What Type of Item Is It?"
                    onChange={handleChange('category')}
                    defaultValue={values.category}
                    // variant="outlined"
                    autoComplete="chair"
                    fullWidth
                  />
                </Grid>
                <br />
                {/* username */}
                <Grid item xs={12}>
                  <TextField 
                    placeholder="Username"
                    label="Username"
                    onChange={handleChange('username')}
                    defaultValue={values.username}
                    // variant="outlined"
                    autoComplete="username"
                    fullWidth
                  />
                </Grid>
                <br />
                {/* password */}
                <Grid item xs={12}>
                  <TextField 
                    placeholder="Password"
                    label="Password"
                    onChange={handleChange('password')}
                    defaultValue={values.password}
                    // variant="outlined"
                    autoComplete="password"
                    fullWidth
                    type="password"
                  />
                </Grid>
            </Grid>
            <br />
            <Button 
              onClick={ Continue }
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Next
            </Button>
          </form>
        </div>
        <br/> 
      </Container>
    )
  }
  
  export default UserDetails