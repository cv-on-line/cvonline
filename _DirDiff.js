
/* compare selected files in 2 FIXED directories */
var aShell = WScript.CreateObject("WScript.Shell"); 
var fso = WScript.CreateObject("Scripting.FileSystemObject");

/* list css/html files in the working directory (new version) */
e = new Enumerator(fso.GetFolder(aShell.CurrentDirectory).files);
var newList = []; var i = 0;
for (e.moveFirst(); ! e.atEnd(); e.moveNext()) {								// stores the new list in an array 
	var file = e.item();
	if (fileType(file.name)) {
		newList[i] = file.name;
		i++
	}
}
/* list css/html files in the archive directory (baseline) */
f = new Enumerator(fso.GetFolder(aShell.CurrentDirectory+"\\Archive").files);
var refList = []; var i = 0;
for (f.moveFirst(); ! f.atEnd(); f.moveNext()) {								// stores the previous list in an array 
	var file = f.item();
	if (fileType(file.name)) {
		refList[i] = file.name;
		i++
	}
}
/* compare the 2 arrays & store differences into diffList array */
var diffList = []; var i=0;
for (i=0;i<refList.length;i++) {
diffListArg = refList[i];
	for (j=0;j<newList.length;j++) {
		if (newList[j]==diffListArg) {
			diffListArg = null;
			break;
		}
	}
	if 	(diffListArg !== null) {
		diffList.push("  [deleted]  "+diffListArg);
		refList.splice(i, 1);
	}
}
for (i=0;i<newList.length;i++) {
	diffListArg = newList[i];
	for (j=0;j<refList.length;j++) {
		if (refList[j]==diffListArg) {
			diffListArg = null;
			break;
		}
	}
	if 	(diffListArg !== null) {
		diffList.push("  [added]    "+diffListArg);
		newList.splice(i, 1);
	}
}

for (i=0;i<newList.length;i++) {
var newArray = []; var refArray = [];
	try {
		var newFile = fso.OpenTextFile(aShell.CurrentDirectory+"\\"+newList[i], 1, 0, -2);
		var refFile = fso.OpenTextFile(aShell.CurrentDirectory+"\\Archive\\"+newList[i], 1, 0, -2);
	}
	catch(error) {
		wo("Error when opening "+newList[i]+". Script aborted.\n");
		WScript.Quit();
	}
	
	while(!newFile.AtEndOfStream ){
		newArray.push(newFile.ReadLine());   
	}

	while(!refFile.AtEndOfStream ){
		refArray.push(refFile.ReadLine());   
	}

	if (refArray.length !== refArray.length) diffList.push("  [modified] "+newList[i]);
	else {
		for (k=0;k<newArray.length;k++) {
			if (newArray[k] !== refArray[k]) {
				diffList.push("  [modified] "+newList[i]);
				break;
			}
		}
	}
	refFile.Close(); newFile.Close();

}
if (diffList.length==0) wo("No changes identified in the last archived version.\n");
else {
	wo("Changes in the last archived version:");
	for (i=0;i<diffList.length;i++) {
		wo(diffList[i]);
}	
	wo("\n");
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* testing the file extension */
function fileType (fname) {
	var ret = 0;
	if ((fname.substring(fname.length-4, fname.length) == ".css") 
	|| (fname.substring(fname.length-4, fname.length) == ".htm") 
	|| (fname.substring(fname.length-5, fname.length) == ".html")) {
		ret = -1;
	}
	return ret;
}

function wo(x){
	WScript.echo(x);
return;
}