/**
 * Application server logger.
 */
module.exports = function(request, response, next) {
    
	var method = request.method;
	var start = +new Date();
	var url = request.url;
	

	response.on('finish', function() {
			var duration = +new Date() - start;
			var message = method + ' to ' + url + '\ntook ' + duration + ' ms \n';
			console.log(message);
	});
	next();
}
