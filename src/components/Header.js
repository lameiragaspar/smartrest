'use client';

import React from "react";
import { motion } from "framer-motion";
import Image from "react-bootstrap/Image";


export default function Header(){
    return(
        <header className="app-header">
            <motion.div
                initial = {{opacity:0, y:-50, x:0}}
                animate = {{opacity:1, y:0, x:0}}
                transition = {{duration:0.6, ease:'easeOut'}}
            >
                <Image
                    className="logo"
                    src="/logo.png"
                    alt="Logo"
                    width={120}
                    height={120}
                ></Image>
            </motion.div>
        </header>
    )
}