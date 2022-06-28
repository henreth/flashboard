import React, { useState } from 'react'
import './Table.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function Table({ data,filterRogue }) {
    let dataToDisplay = data.map((block, i) => {
        let hasMegaBundle = block.transactions.some(tx => { return tx.is_megabundle })

        let nonRogueBundles = block.transactions.filter(tx=>tx.bundle_type!=='rogue')

        let numNonRougeBundles = block.transactions.reduce((tot, tx) => {
            if (tx.bundle_type !== 'rogue') {
                return tot + 1
            }
            return tot
        }, 0)

        let nonRogueReward = block.transactions.reduce((tot,tx) => {
            if (tx.bundle_type !== 'rogue')return tot + parseInt(tx.total_miner_reward)
            return tot
        },0)

        let nonRogueGasUsed = block.transactions.reduce((tot,tx) => {
            if (tx.bundle_type !== 'rogue')return tot + parseInt(tx.gas_used)
            return tot
        },0)

        let nonRogueGasPrice = Math.round(nonRogueReward / nonRogueGasUsed / (10 ** 9))

        const minerReward = filterRogue ? nonRogueReward : (block.miner_reward / (10 ** 18)).toFixed(4)

        return (
            <tr key={i}>
                <td>
                    <a href={'https://etherscan.io/block/' + block.block_number}>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='block-link' />
                        {block.block_number}
                    </a>
                </td>
                <td>Ξ {minerReward}</td>
                <td>{block.gas_used}</td>
                <td>{Math.round(block.miner_reward / block.gas_used / (10 ** 9))}
                    <span> gwei</span>
                </td>
                <td className={hasMegaBundle ? 'hasMegaBundle' : ''}>{hasMegaBundle ? '✓' : 'x'}</td>
                <td>{block.transactions.length}</td>

            </tr>
        )
    })
    return (
        <React.Fragment>

            <div className='table-wrapper'>
                <table className='fl-table'>
                    <thead className='table-header'>
                        <tr>
                            <th>Block Number</th>
                            <th>Miner Reward</th>
                            <th>Gas Used</th>
                            <th>Gas Price</th>
                            <th className='megabundle'>
                                <div>Contains</div>
                                <div><span>MegaBundle?</span></div>
                            </th>
                            <th>Bundles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToDisplay}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
}