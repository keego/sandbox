
var recentCommentIds = [];
var commentIds = ["a", "b", "c", "d", "e"];
var numberOfComments = 3;

for (var i = commentIds.length - numberOfComments; i <= commentIds.length - 1; i++ ) {
    recentCommentIds.push(commentIds[i]);
}

console.log(recentCommentIds);
