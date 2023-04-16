import React, { useState, useEffect } from 'react';
import { List, Table } from '@mantine/core'
import Alert from 'react-bootstrap/Alert';
import Fade from 'react-bootstrap/Fade'
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

function ShoppingCartList(props) {
    const {totals} = props

    return (
        <>
            <div className='container m-2'>
                {/* <List>
                    {
                        Object.keys(totals).map((ingredient) => (
                            <List.Item key={ingredient}>{ingredient}: {totals[ingredient]} oz</List.Item>
                        ))
                    }
                </List> */}
                <Table maw="500px">
                    <thead>
                        <tr>
                            <th>Ingredient</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(totals).map((ingredient) => (
                                <tr key={ingredient}>
                                    <td>{ingredient}</td>
                                    <td>{totals[ingredient]} oz</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
            
        </>
    )
}

export default ShoppingCartList;