import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function Table({ data,filterRogue }) {
    let dataToDisplay = data.map((block, i) => {
        let nonRogueBundles = block.transactions.filter(tx=>tx.bundle_type!=='rogue')

        let NonRougeNumBundles = block.transactions.reduce((tot, tx) => (tx.bundle_type !== 'rogue' ? tot + 1 : tot),0)

        let nonRogueReward = block.transactions.reduce((tot,tx) => (tx.bundle_type !== 'rogue' ? tot + parseInt(tx.total_miner_reward): tot),0)

        let nonRougeMinerReward = (nonRogueReward / (10 ** 18)).toFixed(4)

        let nonRogueGasUsed = block.transactions.reduce((tot,tx) => (tx.bundle_type !== 'rogue' ?  tot + parseInt(tx.gas_used) : tot),0)

        let nonRogueGasPrice = Math.round(nonRogueReward / nonRogueGasUsed / (10 ** 9))

        const nonRogueHasMegaBundle = block.transactions.filter(tx=>tx.bundle_type!=='rogue').some(tx => tx.is_megabundle)


        //all (including rogue)
        const inclusiveMinerReward = (block.miner_reward / (10 ** 18)).toFixed(4)
        const inclusiveGasUsed = block.gas_used
        const inclusiveGasPrice = Math.round(block.miner_reward / block.gas_used / (10 ** 9))
        const inclusiveNumBundles = block.transactions.length
        const inclusiveHasMegaBundle = block.transactions.some(tx => { return tx.is_megabundle })

        // Table Data
        const minerReward = filterRogue ? nonRougeMinerReward : inclusiveMinerReward
        const gasUsed = filterRogue ? nonRogueGasUsed : inclusiveGasUsed
        const gasPrice = filterRogue ? nonRogueGasPrice : inclusiveGasPrice
        const hasMegaBundle = filterRogue ? nonRogueHasMegaBundle : inclusiveHasMegaBundle
        const numBundles = filterRogue ? NonRougeNumBundles : inclusiveNumBundles

        //
        const displayMegaBundle = hasMegaBundle ? '✓' : 'x'
        const megaBundleClass = hasMegaBundle ? 'hasMegaBundle' : 'noMegaBundle'

        return (
            <tr key={i}>
                <td>
                    <a href={'https://etherscan.io/block/' + block.block_number}>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='block-link' />
                        {block.block_number}
                    </a>
                </td>
                <td>Ξ {minerReward}</td>
                <td>{gasUsed}</td>
                <td>{gasPrice}
                    <span> gwei</span>
                </td>
                <td className={megaBundleClass}>{displayMegaBundle}</td>
                <td>{numBundles}</td>

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