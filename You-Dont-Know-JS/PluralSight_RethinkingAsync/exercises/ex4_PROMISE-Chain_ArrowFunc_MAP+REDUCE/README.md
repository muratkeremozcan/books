# Instructions

1. You'll do the same thing as the previous exercise(s), but now you should use map/reduce, promises, and an array of files.

2. Expected behavior:
	- Request all 3 files at the same time (in "parallel").
	- Render them ASAP (don't just blindly wait for all to finish loading)
	- BUT, render them in proper (obvious) order: "file1", "file2", "file3".
	- After all 3 are done, output "Complete!".
