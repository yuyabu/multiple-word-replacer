function multiWordReplacer(inputedDictionary,selected_separeter, textForConvert){
	let mapForConvert = makeMap(inputedDictionary, separeter[selected_separeter]);
	let mapKeys = Array.from(mapForConvert.keys());
	mapKeys.sort(function(a,b){
		return b.length - a.length;
	});
	var re = new RegExp(mapKeys.join("|"),"g");

	var result = textForConvert.replace(re,function(matched){
		return mapForConvert.get(matched);
	});
	return result;
}

function makeMap(textToMap,separator){
	let lines = textToMap.split('\n');
	let forAlert = '';
	let resultMap = new Map();
	for(var line = 0; line <lines.length; line++){
		let mapPart = lines[line].split(separator);
		if(mapPart.length != 2){
			forAlert += (lines[line] + '\n');
			continue;
		}
		resultMap.set(mapPart[0], mapPart[1]);
	}
	return resultMap;
}
