import React from 'react'
// import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Grid, TextField, Button } from '@material-ui/core'
import { useForm } from "react-hook-form";


const ProductDetails = ({ nextStep, handleChange, values }) => {
  
    // for continue event listener
    const Continue = e => {
      e.preventDefault();
      nextStep();
    }
    //for upload pictures 
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const res = await fetch("http://localhost:5000/upload-file", {
            method: "POST",
            body: formData,
        }).then((res) => res.json());
        alert(JSON.stringify(`${res.message}, status: ${res.status}`));
    };
  
    return (
      <Container  component="main" maxWidth="xs">
        <div>  
          <Typography  component="h1" variant="h5" className='content-center '> 
           Fill in form about Product Information 
          </Typography> 
          <br/> 
          <div> Selling with Khmer furniture is free and easy. We look for furniture that meets our standards for quality and durability.
          After your pickup, we’ll email you an instant offer </div>
          <br/> 
          <div> Accept it, and you can cash out immediately without waiting for your items to sell.
           Decline or ignore your offer and you’ll earn a revenue share post-sale instead.</div>
           <br/>
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
                    // autoComplete="chair"
                    fullWidth
                  />
                </Grid>
                <br />
                {/* Product Name */}
                <Grid item xs={12}>
                  <TextField 
                    placeholder="Product Name "
                    label="What Is the Name of Your Item?"
                    onChange={handleChange('productName')}
                    defaultValue={values.productName}
                    // variant="outlined"
                    // autoComplete="productName"
                    fullWidth
                  />
                </Grid>
                <br />
                {/* Brand Name */}
                <Grid item xs={12}>
                  <TextField 
                    placeholder="Brand Name"
                    label="What Brand Is Your Item? "
                    onChange={handleChange('brandName')}
                    defaultValue={values.brandName}
                    // variant="outlined"
                    // autoComplete="password"
                    fullWidth
                    // type="password"
                  />
                </Grid>
                  {/* Additional Notes */}
              <Grid item xs={12}>
                <TextField 
                  placeholder="Additional Notes (Optional)"
                  label="Additional Notes (Optional)"
                  onChange={handleChange('levelOfEducation')}
                  defaultValue={values.levelOfEducation}
                  autoComplete="Level of Education"
                  fullWidth
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
  
  export default ProductDetails