import React, {useState} from 'react'
import styles from './Header.module.scss'
import {Box} from '@mui/material'
import { NavLink } from 'react-router'
import { getCookie } from './../../functions/cookies';

export default function Header() {
  const userType = getCookie("userType")
  if (! userType) {return <></>}
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
        {(userType=="student" || userType=="parent") && <Box>
            <NavLink
                to="/teachers"
                className={({ isActive }) =>
                isActive ? styles.active : ""
                }
            >
                Korepetytorzy
            </NavLink>
        </Box>}
        {(userType=="student" || userType=="parent" || userType=="teacher") && 
        
            <Box>
                <NavLink
                    to="/my-lessons"
                    className={({ isActive }) =>
                    isActive ? styles.active : ""
                    }
                >
                    {(userType=="student" || userType=="teacher") ? 'Moje zajęcia' : "Zajęcia dziecka"}
                </NavLink>
            </Box>
        }
        {(userType=="student" || userType=="parent") && 
            <Box>
                <NavLink
                    to="/my-teachers"
                    className={({ isActive }) =>
                    isActive ? styles.active : ""
                    }
                >
                    {userType=="student" ? 'Moi Korepetytorzy' : "Korepetytorzy dziecka"}
                </NavLink>
            </Box>
        }
        {userType=="teacher" && 
        <>
            <Box>
                <NavLink
                    to="/my-reviews"
                    className={({ isActive }) =>
                    isActive ? styles.active : ""
                    }
                >
                    Moje oceny
                </NavLink>
            </Box>
            <Box>
                <NavLink
                    to="/add-lesson"
                    className={({ isActive }) =>
                    isActive ? styles.active : ""
                    }
                >
                    Dodaj zajęcia
                </NavLink>
            </Box>
        </>}
        {userType=="company" && 
        <>
            <Box>
            <NavLink
                to="/register-teacher"
                className={({ isActive }) =>
                isActive ? styles.active : ""
                }
            >
                Zarejestruj korepetytora
            </NavLink>
            </Box>
        </>}
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
