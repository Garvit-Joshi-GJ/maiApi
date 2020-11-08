import Query from '../models/queryModel';

export const getQueries = (req, res, next) => {

    Query.find({})
    .then(data => {
        if (data.length) {
          res.status(200).json({
            statusCode: 200,
            message: "Queries fetched successfully",
            data: {queries: data}
          });
        } else {
          res.status(404).json({
            statusCode: 404,
            message: "No Data Found"
          })
        }
    })
    .catch(err => {
        res.status(500).json({
          statusCode: 500,
          data: err,
          message: err.message
        });
    });
}