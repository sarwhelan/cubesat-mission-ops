/**
 * Node modules required.
 */
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({extended: false});
const parseJSON = bodyParser.json();

/**
 * Internal imports.
 */
var db = require('../database');

/**
 * Root path requests.
 */
router.route('/')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            // Returns all images saved in the database.
            db.query('SELECT imageID, queuedTelecommandID, metadata, tags, name, favorited, type FROM images', function(error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    const retVal = [];

                    for(let i = 0; i < results.length; i++) {
                        retVal.push({
                            src: `/media/${results[i].imageID}`,
                            previewSrc: `/media/${results[i].imageID}/preview`,
                            type: results[i].type,
                            name: results[i].name,
                            tags: [],
                            id: results[i].imageID
                        });
                    }

                    res.json(retVal);
                }
            });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

/**
 * Path requests with a given ID.
 * GET: Handles with an Image ID.
 */
router.route('/:id')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            // Returns image data from given image ID.
            const queryInput = [req.params.id];
            db.query('SELECT data, dataType FROM images WHERE imageID = ?', queryInput, function(error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    if (results.length > 0) {
                        var buffer = Buffer.from(results[0].data, 'base64');
                        res.set('Content-Type', results[0].dataType);
                        res.set('Content-Length', buffer.length);
                        res.end(buffer);
                    } else {
                        res.send(null);
                    }
                }
            });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

/**
 * Path requests with a given ID, specifically for preview.
 */
router.route('/:id/preview')
    .get(parseUrlencoded, parseJSON, (req, res) => {
        try {
            // Returns image preview data from given image ID.
            const queryInput = [req.params.id];
            db.query('SELECT previewData, previewDataType FROM images WHERE imageID = ?', queryInput, function(error, results, fields) {
                if (error) {
                    throw error;
                } else {
                    if (results.length > 0) {
                        var buffer = Buffer.from(results[0].previewData, 'base64');
                        res.set('Content-Type', results[0].previewDataType);
                        res.set('Content-Length', buffer.length);
                        res.end(buffer);
                    } else {
                        res.send(null);
                    }
                }
            });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    });

module.exports = router;