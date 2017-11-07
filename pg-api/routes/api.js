const express = require('express');
const router = express();

const pool = require('../modules/pool');

router.get('/countries', function (req, res) {
    pool.connect(function (err, db, done) {
        if (err) {
            console.error(err);
            res.status(500).send({ 'error': err });
        } else {
            db.query('SELECT * FROM country', function (err, table) {
                done();
                if (err) {
                    return res.status(400).send({ error: err })
                } else {
                    return res.status(200).send(table.rows)
                }
            })
        }
    })
});

router.post('/new-country', function (req, res) {
    const country_name = req.body.country_name;
    const continent_name = req.body.continent_name;

    pool.connect((err, db, done) => {
        if (err) {
            console.error('error open connection', err);
            return res.status(400).send({ error: err });
        }
        else {
            db.query('INSERT INTO country( country_name, continent_name ) VALUES ($1,$2)',
                [country_name, continent_name], (err, table) => {
                    done();
                    if (err) {
                        console.error('error running query', err);
                        return res.status(400).send({ error: err });
                    }
                    else {
                        console.log('Data Inserted: successfully!');
                        res.status(201).send({ message: 'Data Inserted!' })
                    }
                })
        }
    });

    console.log(req.body);
});


router.delete('/remove/:id', function (req, res) {
    const id = req.params.id;

    pool.connect(function (err, db, done) {
        if (err) {
            return res.status(400).send(err)
        } else {
            db.query('DELETE FROM country WHERE ID = $1', [Number(id)], function (err, result) {
                done();
                if (err) {
                    return res.status(400).send(err)
                } else {
                    return res.status(200).send({ message: 'success delete record' })
                }
            })
        }
    })
    console.log(id);
});

router.put('/update-country', function (req, res) {
    const country_name = req.body.country_name;
    const continent_name = req.body.continent_name;
    const id = req.body.id;

    pool.connect((err, db, done) => {
        if (err) {
            console.error('error open connection', err);
            return res.status(400).send({ error: err });
        }
        else {
            db.query('UPDATE country SET country_name=$1, continent_name=$2 WHERE ID=$3',
                [country_name, continent_name, id], (err, table) => {
                    done();
                    if (err) {
                        console.error('error running query', err);
                        return res.status(400).send({ error: err });
                    }
                    else {
                        console.log('Data Inserted: successfully!');
                        res.status(201).send({ message: 'Data Updated!' })
                    }
                })
        }
    });

    console.log(req.body);
})

module.exports = router;