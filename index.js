'use strict';
const axios = require('axios');
const airport = require('./data/selected-airport');
const mongo = require('./lib/mongodb');
const mongoose = require('mongoose');

const model = { time: String, name: String, data: [] };
const schema = new mongoose.Schema(model);
const COLLECTION = "crawler";

mongo.connect();

exports.main_handler = async (event, context, callback) => {
    const from = airport.from;
    const to = airport.to;
    
    let searchList = from.map(fromItem => {
        return to.map(toItem => {
            return {
                from: fromItem,
                to: toItem
            }
        })
    }).reduce((pre, cur) => {
        return pre.concat(cur);
    }, []);

    let result = [];
    for (let i = 0; i < searchList.length; i++) {
        const line = searchList[i];
        const fromData = line.from.data.split('|');
        const fromId = fromData[fromData.length - 1];
        const toData = line.to.data.split('|');
        const toId = toData[toData.length - 1];
        const lowestPrice = await axios({
            method: 'post',
            url: 'https://flights.ctrip.com/itinerary/api/12808/lowestPrice',
            data: { "flightWay": "Oneway", "dcity": fromId, "acity": toId, "army": false }
        }).then(res => res.data.data.oneWayPrice)
        result.push({
            from: line.from.display,
            to: line.to.display,
            lowestPrice: lowestPrice
        })
    }

    console.log(result);

    const mongoResult = await mongo.insert(COLLECTION, schema, {
        time: new Date(),
        data: result,
        name: 'lowestPrice'
    });

    console.log(mongoResult)

    return result
};