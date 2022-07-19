import React from 'react'
import { Carousel, Image, Flex, Text, Button, Toolbar, Header, Divider } from '@fluentui/react-northstar'
import "./Carousel.css";


function JobCarousel(props) {

  const tabAriaLabel = {
    allan: 'Allan',
    carole: 'Carole',
    elvia: 'Elvia',
    kat: 'Kat',
  }

  // const carouselItems = [
  //   {
  //     key: 'allan',
  //     id: 'allan',
  //     content: (
  //       <div>

  //         <Text>
  //           <Header as="h6" align="center"> Job Title </Header>

  //             <p>Job Id : </p> 
  //             <p>Location : </p>
  //         </Text>

  //       </div>
  //     ),
  //     'aria-label': 'Allan card',
  //   },
  // ]

  const carouselItems = props.RJobs.map((item) => ({
    
      key: 'Recommended Job',
      id: 'Recommended Job',
      content: (
        <div>

          <Text>
            <Header style={{fontSize: "17px"}} align="center"> {item.jobTitle} </Header>
            <Divider/>
              <p><b>Location :</b> {item.jobLocation.City} </p>
              <p><b>Job Id :</b> {item.externalJobOpeningId} </p> 
          </Text>

        </div>
      ),
      'aria-label': 'Allan card',
  })
    
  )

  return (
    <Carousel
      className="carouselCard"
      navigation={{
        'aria-label': 'Job cards',
        type: Button,
        items: carouselItems.map((item, index) => ({
          key: item.id,
          'aria-label': tabAriaLabel[item.id],
          'aria-controls': item.id,
        })),
      }}
      items={carouselItems}
      getItemPositionText={(index, size) => `${index + 1} of ${size}`}
    />
  )
}

export default JobCarousel
