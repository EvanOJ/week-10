
/** Find the N closest aviation incidents */
function nClosest(point, n) {
  // The SQL in english:
  // SELECT (all data) FROM (the table, world_bank_projects)
  // ORDER BY (distance of these geoms from the provided point)
  // LIMIT (to n cases)
  var sql = 'SELECT * FROM aviationdata ORDER BY the_geom <-> ST_Point(' + point.lng + ',' + point.lat + ') LIMIT ' + n;

  $.ajax('https://evanoj.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    //console.log(n +' closest:', results);
    addRecords(results);
  });
}

/** Find all points within the box constructed */
function pointsWithin(rect) {
  // Grab the southwest and northeast points in this rectangle
  var sw = rect[0];
  var ne = rect[2];

  var sql = 'SELECT * FROM aviationdata WHERE the_geom @ ST_MakeEnvelope(' +
    sw.lng + ','+ sw.lat + ',' + ne.lng + ',' + ne.lat + ', 4326)';

  $.ajax('https://evanoj.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    //console.log('pointsWithin:', results);
    addRecords(results);
  });
}


/**
 * function for adding one record
 *
 * The pattern of writing the function which solves for 1 case and then using that function
 *  in the definition of the function which solves for N cases is a common way to keep code
 *  readable, clean, and think-aboutable.
 */
function addOneRecord(rec) {
  var title = $('<p></p>')
    .text('Accident Number: ' + rec.accident_number);

  var location = $('<p></p>')
    .text('Location: ' + rec.location + ', ' + rec.country);

  var severity = $('<p></p>')
    .text('Fatal Injuries: ' + rec.total_fatal_injuries);


  var recordElement = $('<li></li>')
    .addClass('list-group-item')
    .append(title)
    .append(location)
    .append(severity);

  $('#project-list').append(recordElement);
}

/** Given a cartoDB resultset of records, add them to our list */
function addRecords(cartodbResults) {
  $('#project-list').empty();
  _.each(cartodbResults.rows, addOneRecord);
}
