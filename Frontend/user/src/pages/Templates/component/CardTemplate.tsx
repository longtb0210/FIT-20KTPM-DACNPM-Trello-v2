import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardMedia, CardActions } from '@mui/material'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '../../../components/Theme/themeContext'

import {
  featureData,
  newTemplateData,
  businessData,
  designData,
  educationData,
  techniqueData,
  marketingData,
  pmData,
  wrData
} from '../testData/templatesData'

function CardTemplate() {
  const { darkMode, colors } = useTheme()

  const buttonStyle: React.CSSProperties = {
      backgroundColor: colors.button_hover,
      color: colors.text,
      transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out'
  };
  return (
    <div 
      className='detail-card-container mx-4 w-full min-w-min max-w-screen-lg md:mx-auto'
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <div className='features'>
        <div className='title-container mr-6 flex items-center justify-between'>
          <div className='title flex items-center'>
            <label className='text-lg font-bold'>Featured categories</label>
          </div>
          <div className='search-container relative'>
            <input
              className='max-w-240px min-w-240px relative box-border h-10 rounded-md border border-gray-300 bg-white px-8'
              id='inputSearch'
              placeholder='Search'
            ></input>
            <span className='search-icon pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 transform'>
              <SearchIcon fontSize='small' />
            </span>
          </div>
        </div>
        <div className='nameFeatures scrollbar-thin scrollbar-thumb-black scrollbar-track-black flex w-full justify-start overflow-x-auto'>
          {featureData.map((feature, index) => (
            <div key={index} className='item-feature mb-16 mr-3 flex w-32 flex-col items-center text-center'>
              <Card
                variant='elevation'
                elevation={0}
                className='detail-item mx-auto mt-8 block h-full w-full text-sm capitalize leading-6 text-gray-600 hover:cursor-pointer'
                sx={{
                  backgroundColor: colors.background,
                  color: colors.text
                }}
              >
                <CardMedia
                  className='h-140 relative w-full transform transition duration-300 ease-in-out hover:shadow-xl'
                  component='img'
                  image={feature.image}
                  alt={feature.name}
                />
                {feature.name}
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className='newTemplate'>
        <div className='title flex flex items-center items-center'>
          <img
            className='mr-3 inline-block h-6 w-6 min-w-6 rounded-md'
            src='https://trello.com/assets/32ad10f52fc078a76ea4.svg'
            width='24px'
            height='24px'
          ></img>
          <label className='text-lg font-bold'>New and notable templates</label>
        </div>
        <div className='detail-newTemplate justify-starts mt-5 flex w-full flex-wrap'>
          {newTemplateData.map((card, index) => (
            <Card
              key={index}
              variant='elevation'
              elevation={0}
              className='item-newTemplate min-h-100 mx-auto w-full hover:cursor-pointer md:w-72'
              sx={{
                backgroundColor: colors.background,
                color: colors.text
              }}
            >
              <div className='cardContainer relative w-72'>
                <CardMedia
                  className='h-40 w-full transform object-cover duration-300 ease-in-out hover:shadow-xl'
                  component='img'
                  image={card.image}
                  alt={card.title}
                />
              </div>
              <CardContent>
                <label className='content-title flex items-center text-base font-bold'>
                  {card.title}
                </label>
                <p className='content text-sm leading-6'>by {card.author}</p>
                <p className='content text-sm leading-6'>{card.description}</p>
              </CardContent>
              <CardActions disableSpacing>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='add to favorites'>
                  <ContentCopyOutlinedIcon fontSize='small' />
                  {card.likes}
                </button>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='share'>
                  <VisibilityOutlinedIcon fontSize='small' />
                  {card.views}
                </button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      <div className='business'>
        <div className='title mb-6 mt-6 flex items-center'>
          <img
            className='mr-3 inline-block h-6 w-6 min-w-6 rounded-md'
            src='https://trello.com/assets/6b1a625e841b96791d68.svg'
            width='24px'
            height='24px'
          ></img>
          <label className='text-lg font-bold'>Business</label>
          <button 
            className='ml-auto mr-6 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1 font-sans text-base font-medium'
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg_button_active_hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.button_hover}
            >
            More templates for Business
          </button>
        </div>
        <div className='detail-newTemplate mt-5 flex w-full flex-wrap justify-start'>
          {businessData.map((business, index) => (
            <Card
              key={index}
              variant='elevation'
              elevation={0}
              className='item-newTemplate min-h-100 mx-auto w-full max-w-sm border-0 hover:cursor-pointer md:w-72'
              sx={{
                backgroundColor: colors.background,
                color: colors.text
              }}
            >
              <div className='cardContainer relative w-72'>
                <CardMedia
                  className='h-40 w-full transform object-cover duration-300 ease-in-out hover:shadow-xl'
                  component='img'
                  image={business.image}
                  alt={business.title}
                />
              </div>
              <CardContent>
                <label className='content-title flex items-center text-base font-bold'>
                  {business.title}
                </label>
                <p className='content text-sm leading-6'>by {business.author}</p>
                <p className='content text-sm leading-6'>{business.description}</p>
              </CardContent>
              <CardActions disableSpacing>
                <button className='icon mr-5 mr-5 inline-flex h-5 text-sm text-gray-600' aria-label='add to favorites'>
                  <ContentCopyOutlinedIcon fontSize='small' />
                  {business.likes}
                </button>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='share'>
                  <VisibilityOutlinedIcon fontSize='small' />
                  {business.views}
                </button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      <div className='design'>
        <div className='title mb-6 mt-6 flex items-center'>
          <img
            className='mr-3 inline-block h-6 w-6 min-w-6 rounded-md'
            src='https://trello.com/assets/e617072931480fdd44da.svg'
            width='24px'
            height='24px'
          ></img>
          <label className='text-lg font-bold'>Design</label>
          <button 
            className='ml-auto mr-6 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1 font-sans text-base font-medium'
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg_button_active_hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.button_hover}
          >
            More templates for Design
          </button>
        </div>
        <div className='detail-newTemplate mt-5  flex w-full flex-wrap justify-start'>
          {designData.map((design, index) => (
            <Card
              key={index}
              variant='elevation'
              elevation={0}
              className='item-newTemplate min-h-100 mx-auto w-full max-w-sm hover:cursor-pointer md:w-72'
              sx={{
                backgroundColor: colors.background,
                color: colors.text
              }}
            >
              <div className='cardContainer relative w-72'>
                <CardMedia
                  className='h-40 w-full transform object-cover duration-300 ease-in-out hover:shadow-xl'
                  component='img'
                  image={design.image}
                  alt={design.title}
                />
              </div>
              <CardContent>
                <label className='content-title flex items-center text-base font-bold'>
                  {design.title}
                </label>
                <p className='content text-sm leading-6'>by {design.author}</p>
                <p className='content text-sm leading-6'>{design.description}</p>
              </CardContent>
              <CardActions disableSpacing>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='add to favorites'>
                  <ContentCopyOutlinedIcon fontSize='small' />
                  {design.likes}
                </button>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='share'>
                  <VisibilityOutlinedIcon fontSize='small' />
                  {design.views}
                </button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      <div className='education'>
        <div className='title mb-6 mt-6 flex items-center'>
          <img
            className='mr-3 inline-block h-6 w-6 min-w-6 rounded-md'
            src='https://trello.com/assets/070ebae9f7177f08cff6.svg'
            width='24px'
            height='24px'
          ></img>
          <label className='text-lg font-bold'>Education</label>
          <button 
            className='ml-auto mr-6 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1 font-sans text-base font-medium'
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg_button_active_hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.button_hover}
          >
            More templates for Education
          </button>
        </div>
        <div className='detail-newTemplate mt-5 flex w-full flex-wrap justify-start'>
          {educationData.map((education, index) => (
            <Card
              key={index}
              variant='elevation'
              elevation={0}
              className='item-newTemplate min-h-100 mx-auto w-full max-w-sm hover:cursor-pointer md:w-72'
              sx={{
                backgroundColor: colors.background,
                color: colors.text
              }}
            >
              <div className='cardContainer relative w-72'>
                <CardMedia
                  className='h-40 w-full transform object-cover duration-300 ease-in-out hover:shadow-xl'
                  component='img'
                  image={education.image}
                  alt={education.title}
                />
              </div>
              <CardContent>
                <label className='content-title flex items-center text-base font-bold'>
                  {education.title}
                </label>
                <p className='content text-sm leading-6'>by {education.author}</p>
                <p className='content text-sm leading-6'>{education.description}</p>
              </CardContent>
              <CardActions disableSpacing>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='add to favorites'>
                  <ContentCopyOutlinedIcon fontSize='small' />
                  {education.likes}
                </button>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='share'>
                  <VisibilityOutlinedIcon fontSize='small' />
                  {education.views}
                </button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      <div className='technique'>
        <div className='title mb-6 mt-6 flex items-center'>
          <img
            className='mr-3 inline-block h-6 w-6 min-w-6 rounded-md'
            src='https://trello.com/assets/457121414fa10aa6029a.svg'
            width='24px'
            height='24px'
          ></img>
          <label className='text-lg font-bold'>Engineering</label>
          <button 
            className='ml-auto mr-6 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1 font-sans text-base font-medium'
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg_button_active_hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.button_hover}
          >
            More templates for Engineering
          </button>
        </div>
        <div className='detail-newTemplate mt-5  flex w-full flex-wrap justify-start'>
          {techniqueData.map((technique, index) => (
            <Card
              key={index}
              variant='elevation'
              elevation={0}
              className='item-newTemplate min-h-100 mx-auto w-full max-w-sm hover:cursor-pointer md:w-72'
              sx={{
                backgroundColor: colors.background,
                color: colors.text
              }}
            >
              <div className='cardContainer relative w-72'>
                <CardMedia
                  className='h-40 w-full transform object-cover duration-300 ease-in-out hover:shadow-xl'
                  component='img'
                  image={technique.image}
                  alt={technique.title}
                />
              </div>
              <CardContent>
                <label className='content-title flex items-center text-base font-bold'>
                  {technique.title}
                </label>
                <p className='content text-sm leading-6'>by {technique.author}</p>
                <p className='content text-sm leading-6'>{technique.description}</p>
              </CardContent>
              <CardActions disableSpacing>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='add to favorites'>
                  <ContentCopyOutlinedIcon fontSize='small' />
                  {technique.likes}
                </button>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='share'>
                  <VisibilityOutlinedIcon fontSize='small' />
                  {technique.views}
                </button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      <div className='Marketing'>
        <div className='title mb-6 mt-6 flex items-center'>
          <img
            className='mr-3 inline-block h-6 w-6 min-w-6 rounded-md'
            src='https://trello.com/assets/3695bf4ae87a54c23f88.svg'
            width='24px'
            height='24px'
          ></img>
          <label className='text-lg font-bold'>Marketing</label>
          <button 
            className='ml-auto mr-6 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1 font-sans text-base font-medium'
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg_button_active_hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.button_hover}
          >
            More templates for Marketing
          </button>
        </div>
        <div className='detail-newTemplate mt-5 flex w-full flex-wrap justify-start'>
          {marketingData.map((marketing, index) => (
            <Card
              key={index}
              variant='elevation'
              elevation={0}
              className='item-newTemplate min-h-100 hover: mx-auto w-full max-w-sm cursor-pointer md:w-72'
              sx={{
                backgroundColor: colors.background,
                color: colors.text
              }}
            >
              <div className='cardContainer relative w-72'>
                <CardMedia
                  className='h-40 w-full transform object-cover duration-300 ease-in-out hover:shadow-xl'
                  component='img'
                  image={marketing.image}
                  alt={marketing.title}
                />
              </div>
              <CardContent>
                <label className='content-title flex items-center text-base font-bold'>
                  {marketing.title}
                </label>
                <p className='content text-sm leading-6'>by {marketing.author}</p>
                <p className='content text-sm leading-6'>{marketing.description}</p>
              </CardContent>
              <CardActions disableSpacing>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='add to favorites'>
                  <ContentCopyOutlinedIcon fontSize='small' />
                  {marketing.favoriteCount}
                </button>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='share'>
                  <VisibilityOutlinedIcon fontSize='small' />
                  {marketing.visibilityCount}
                </button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      <div className='projectManagement'>
        <div className='title mb-6 mt-6 flex items-center'>
          <img
            className='mr-3 inline-block h-6 w-6 min-w-6 rounded-md'
            src='https://trello.com/assets/627d9e9f69fc255752cf.svg'
            width='24px'
            height='24px'
          ></img>
          <label className='text-lg font-bold'>Project management</label>
          <button 
            className='ml-auto mr-6 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1 font-sans text-base font-medium'
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg_button_active_hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.button_hover}
          >
            More templates for Project management
          </button>
        </div>
        <div className='detail-newTemplate mt-5 flex w-full flex-wrap justify-start'>
          {pmData.map((pm, index) => (
            <Card
              key={index}
              variant='elevation'
              elevation={0}
              className='item-newTemplate min-h-100 mx-auto w-full max-w-sm hover:cursor-pointer md:w-72'
              sx={{
                backgroundColor: colors.background,
                color: colors.text
              }}
            >
              <div className='cardContainer relative w-72'>
                <CardMedia
                  className='h-40 w-full transform object-cover duration-300 ease-in-out hover:shadow-xl'
                  component='img'
                  image={pm.image}
                  alt={pm.title}
                />
              </div>
              <CardContent>
                <label className='content-title flex items-center text-base font-bold'>{pm.title}</label>
                <p className='content text-sm leading-6'>by {pm.author}</p>
                <p className='content text-sm leading-6'>{pm.description}</p>
              </CardContent>
              <CardActions disableSpacing>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='add to favorites'>
                  <ContentCopyOutlinedIcon fontSize='small' />
                  {pm.favoriteCount}
                </button>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='share'>
                  <VisibilityOutlinedIcon fontSize='small' />
                  {pm.visibilityCount}
                </button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      <div className='workRemotely'>
        <div className='title mb-6 mt-6 flex items-center'>
          <img
            className='mr-3 inline-block h-6 w-6 min-w-6 rounded-md'
            src='https://trello.com/assets/338e484944b19a8df667.svg'
            width='24px'
            height='24px'
          ></img>
          <label className='text-lg font-bold'>Remote work</label>
          <button 
            className='ml-auto mr-6 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1 font-sans text-base font-medium'
            style={buttonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg_button_active_hover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.button_hover}
          >
            More templates for Remote work
          </button>
        </div>
        <div className='detail-newTemplate mt-5  flex w-full flex-wrap justify-start'>
          {wrData.map((wr, index) => (
            <Card
              key={index}
              variant='elevation'
              elevation={0}
              className='item-newTemplate min-h-100 mx-auto w-full max-w-sm hover:cursor-pointer md:w-72'
              sx={{
                backgroundColor: colors.background,
                color: colors.text
              }}
            >
              <div className='cardContainer relative w-72'>
                <CardMedia
                  className='h-40 w-full transform object-cover duration-300 ease-in-out hover:shadow-xl'
                  component='img'
                  image={wr.image}
                  alt={wr.title}
                />
              </div>
              <CardContent>
                <label className='content-title flex items-center text-base font-bold'>{wr.title}</label>
                <p className='content text-sm leading-6'>by {wr.author}</p>
                <p className='content text-sm leading-6'>{wr.description}</p>
              </CardContent>
              <CardActions disableSpacing>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='add to favorites'>
                  <ContentCopyOutlinedIcon fontSize='small' />
                  {wr.favoriteCount}
                </button>
                <button className='icon mr-5 inline-flex h-5 text-sm' aria-label='share'>
                  <VisibilityOutlinedIcon fontSize='small' />
                  {wr.visibilityCount}
                </button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardTemplate
