import React from 'react'
import styles from './Header.module.scss'
import {Box} from '@mui/material'
import { NavLink } from 'react-router'

export default function Header() {
  return (
    <Box className={styles.container}>
        <Box>
            <NavLink
                to="/"
                className={({ isActive }) =>
                isActive ? styles.active : ""
                }
            >
                Strona główna
            </NavLink>
        </Box>
        <Box>
            <NavLink
                to="/teachers"
                className={({ isActive }) =>
                isActive ? styles.active : ""
                }
            >
                Korepetytorzy
            </NavLink>
        </Box>
        <Box>
            <NavLink
                to="/my-lessons"
                className={({ isActive }) =>
                isActive ? styles.active : ""
                }
            >
                Moje zajęcia
            </NavLink>
        </Box>
        <Box>
            <NavLink
                to="/my-profile"
                className={({ isActive }) =>
                isActive ? styles.active : ""
                }
            >
                Mój profil
            </NavLink>
        </Box>
    </Box>
  )
}
