import React, { useState, useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import styles from "./header.module.scss";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import authService from '../../services/authService';

const Header = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef();

    const items = [
        {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => {

            },
        },
        {
            label: 'Sign out',
            icon: 'pi pi-sign-out',
            command: () => {
                confirmDialog({
                    closable: false,
                    draggable: false,
                    message: 'Are you sure you want to proceed?',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    accept,
                    reject
                });
            },
        },
    ];

    const accept = () => {
        authService.logout();
    }

    const reject = () => {
        setMenuVisible(prev => !prev);
    }

    const toggleMenu = (event) => {
        setMenuVisible(!menuVisible);
        if (menuRef.current) {
            menuRef.current.toggle(event);
        }
    };

    return (
        <header className={styles.header}>
            <ConfirmDialog />
            <div className={styles.logo}>Wordy</div>
            <div className={styles.right}>
                <nav>
                    <ul>
                        <li><a className={styles.navItem}>Dictionary</a></li>
                    </ul>
                </nav>
                <div className="avatar">
                    <Avatar onClick={toggleMenu} label="A" className="p-overlay-badge" shape="circle" size="large" style={{ backgroundColor: '#4caf4f', color: '#ffffff' }}>
                    </Avatar>
                    <Menu
                        ref={menuRef}
                        model={items}
                        popup
                        onHide={() => setMenuVisible(false)}
                        visible={menuVisible.toString()}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;