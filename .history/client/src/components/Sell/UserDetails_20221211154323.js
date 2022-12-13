import React from 'react'
import { Container, Typography, Grid, TextField, Button } from '@material-ui/core'

const UserDetails = ({ prevStep, nextStep, handleChange, values }) => {
  
    const Continue = e => {
      e.preventDefault();
      nextStep();
    }
  
    const Previous = e => {
      e.preventDefault();
      prevStep();
    }
  
    return (
      <Container  component="main" maxWidth="xs">
        <div>
          <Typography  component="h1" variant="h5">
           Personal Details
          </Typography>
          <form>
            <Grid container spacing={2}>
  
              {/* first name */}
              <Grid item xs={12} sm={6}>
                <TextField 
                  placeholder="First Name"
                  label="First Name"
                  onChange={handleChange('firstName')}
                  defaultValue={values.firstName}
                />
              </Grid>
              {/* last name */}
              <Grid item xs={12} sm={6}>
                <TextField 
                  placeholder="Last Name"
                  label="Last Name"
                  onChange={handleChange('lastName')}
                  defaultValue={values.lastName}
                />
              </Grid>
              {/* country of residence */}
              <Grid item xs={12}>
                <TextField 
                  placeholder=""
                  label="Email"
                  onChange={handleChange('email')}
                  defaultValue={values.email}
                  autoComplete="email"
                  fullWidth
                />
              </Grid>
  
              {/* country of residence */}
              <Grid item xs={12}>
                <TextField 
                  placeholder=""
                  label="Address"
                  onChange={handleChange('country')}
                  defaultValue={values.country}
                  autoComplete="country"
                  fullWidth
                />
              </Grid>
               {/* Card number */}
              <Grid item xs={12}>
                <TextField 
                   placeholder="Card Number"
                  label="Card Number"
                  fullWidth
                />
              </Grid>
             {/* CCV */}
               <Grid item xs={12} sm={6}>
                <TextField 
                  placeholder="CCV"
                  // label="Card Number"
                 
                />
              </Grid>
              {/* Exp Date */}
              <Grid item xs={12} sm={6}>
                <TextField 
                  placeholder="Exp Date"
                  // label="Last Name"
                />
              </Grid>
              <span> </span>
              <Grid item xs={12} sm={6}>
                <Button 
                  onClick={ Previous }
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Previous
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button 
                  onClick={ Continue }
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    )
  }

export default UserDetails
