import React from 'react'
import styles from './Layout.module.scss'
import {Box} from '@mui/material'
import Header from '../Header/Header'

export default function Layout({children}) {
    return (
        <Box className={styles.container}>
            <Header />
            {children}
        </Box>
  )
}
