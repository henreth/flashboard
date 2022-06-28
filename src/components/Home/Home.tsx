// @ts-ignore
import Graph from '../Graph/Graph.tsx';
// @ts-ignore
import Table from '../Table/Table.tsx';
import React, { useState } from 'react'
import './Home.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


export default function Home({ testData }) {
  let [viewOption, setViewOption] = useState('table')

  const viewGraph = () => setViewOption('graph')
  const viewTable = () => setViewOption('table')

  let graphViewClass = viewOption === 'graph' ? 'tab selected' : 'tab'
  let tableViewClass = viewOption === 'table' ? 'tab selected' : 'tab'

  // filter rogue bundles:
  let [filterRogue, setFilterRogue] = useState(false)

  const filterYes = () => setFilterRogue(true)
  const filterNo = () => setFilterRogue(false)

  let filterYesClass = filterRogue ? 'tab selected' : 'tab'
  let filterNoClass = filterRogue ? 'tab' : 'tab selected'

  //used in table:
  let [pageNum, setPageNum] = useState(1)
  let right = pageNum * 15
  let left = right - 15

  let blockData = testData.slice(left, right)

  function clickLeft() {
    if (pageNum === 1) { }
    else setPageNum(pageNum - 1)
  }

  function clickRight() {
    if (pageNum === 7) { }
    else setPageNum(pageNum + 1)
  }

  //used in graph:
  let [leftBound, setLeftBound] = useState(0)
  let [rightBound, setRightBound] = useState(10)
  let graphData = testData.slice(leftBound, rightBound)

  let labels = graphData.map(block => block.block_number)
  let blockrewards = graphData.map(block => (block.miner_reward / (10 ** 18)).toFixed(4))
  let gasfees = graphData.map(block => block.miner_reward / block.gas_used / (10 ** 9))
  let numBundles = graphData.map(block => block.transactions.length)

  const options = {
    responsive: true,
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Gas Fees',
        data: gasfees,
        borderColor: 'rgb(56, 56, 56)',
        backgroundColor: '#92e0d0',
      },
      {
        label: 'Miner Reward',
        data: blockrewards,
        borderColor: 'rgb(56, 56, 56)',
        backgroundColor: '#25c2a0',
      },
      {
        label: 'Number of Bundles',
        data: numBundles,
        borderColor: 'rgb(56, 56, 56)',
        backgroundColor: '#1a8870',
      }
    ],

  };
  //

  let tableElement = testData ? <Table data={blockData} pageNum={pageNum} setPageNum={setPageNum} left={left} right={right} filterRogue={filterRogue}/> : null
  
  const displayTable = viewOption === 'table' ? <React.Fragment>
    {tableElement}
    <div className='results-message'>
      <div>Currently viewing results {left < 100 ? left + 1 : 91} to {right < 100 ? right : 100} of the last {testData.length} blocks</div>
      <div className='results-control'>
        <button onClick={clickLeft} disabled={pageNum === 1}>{'<'}</button>
        <button onClick={clickRight} disabled={pageNum === 7}>{'>'}</button>
      </div>
    </div>
  </React.Fragment>
    : null


  let graphElement = testData ? <Graph options={options} data={data} /> : null

  function onSliderChange(value) {
    setLeftBound(Math.min(...value))
    setRightBound(Math.max(...value))
  }

  const displayGraph = viewOption === 'graph' ? <React.Fragment>
    <div className="graph-container">
      {graphElement}
    </div>
    <div className='slider-container'>
      <div>Range: {leftBound + 1}:{rightBound}</div>
      <Slider range dots pushable allowCross={false} step={5} defaultValue={[0, 15]} onChange={onSliderChange}
        trackStyle={[{ backgroundColor: '#1a8870' }]}
        handleStyle={[{ backgroundColor: '#92e0d0' }, { backgroundColor: '#92e0d0' }]}
      />
    </div>
  </React.Fragment> : null

  return (
    <div className='home-container'>
      <div className='home-title'>⚡️🤖 Latest 100 Blocks</div>
      <div className='subtitle'>all data provided by the <a href='https://blocks.flashbots.net/'>flashbots mev-blocks api</a></div>
      <div className='options'>
        {/* tabs to select Table or table with information */}
        <div className='tab-container'>
          <div className='view-title'>View:</div>
          <div className={tableViewClass} onClick={viewTable}>Table</div>
          <div className={graphViewClass} onClick={viewGraph}>Graph</div>
        </div>
        <div className='tab-container'>
          <div className='filter-title'>Include Rogue Bundles:</div>
          <div className={filterYesClass} onClick={filterYes}>Yes</div>
          <div className={filterNoClass} onClick={filterNo}>No</div>
        </div>
      </div>

      {displayTable}
      {displayGraph}


      <div className='footer'>
        <a href='https://github.com/henreth/flashboard'>developed by: </a>
        <span>
          <a href='https://github.com/henreth'>@henreth</a>
        </span>
      </div>
    </div >
  );
}


