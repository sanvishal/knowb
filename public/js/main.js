//delete article

$(document).ready(function() {
	$(".delete-article").on("click", function(e) {
		$target = $(e.target);
		id = $target.attr("data-id");
		//console.log(id);
		$.ajax({
			type: "DELETE",
			url: "/articles/" + id,
			success: function(res) {
				alert("Article Deleted Successfully..");
				window.location.href = "/";
			},
			error: function(err) {
				console.log(err);
			}
		});
	});
	$(".alert-error").addClass("alert-danger");
});
