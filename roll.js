const parseMessage = (input) => {
  let times, dice = NaN, modifier = NaN;

  let splitRoll = input.toUpperCase().split('D');

  if (splitRoll.length < 2)
    return false;
  
  let firstPart = splitRoll[0] ? splitRoll[0] : '1';
  let secondPart = splitRoll[1];

  times = parseInt(firstPart);
	if(times === NaN || times <= 0 || times > 100){
		return false;
	}

	if(secondPart.indexOf('+') > 0 ){
		let secondSplit = secondPart.split('+');
		if(secondSplit.length > 2)
			return false;
		dice = parseInt(secondSplit[0]);
		modifier = parseInt(secondSplit[1]);
	} else if (secondPart.indexOf('-') > 0 ){
		let secondSplit = secondPart.split('-');
		if(secondSplit.length > 2)
			return false;
		dice = parseInt(secondSplit[0]);
		modifier = -1 * parseInt(secondSplit[1]);
	} else {
		dice = parseInt(secondPart);
		modifier = 0;
	}

	if(isNaN(dice) || isNaN(modifier)){
		return false;
	}
  
  let rollValues = {
		'times' : times,
		'dice' : dice,
		'modifier' : modifier
	};

	return rollValues;
}

const calculateInput = (roll) => {
  if (!roll) return false;

	let rolls = [], sum = 0;
	for (let i = 0; i < roll.times; i++) {
		rolled = Math.floor(Math.random() * roll.dice) + 1;
		sum += rolled;
		rolls.push(rolled);
	};
	sum += roll.modifier;
	
	return {
    'sum' : sum,
    'rolls' : rolls
  };
}

const errorMessage = 
  'You must specify dice and modifiers in format: /roll <NDM>\n'+
  'N = Number of dices\n'+
  'D = Type of dices (D6, D12, D20)\n'+
  'M = Modifiers (+1, -3)\n'+
  'Example: /roll 3D6+3';

const outputMessage = (userName, inputRoll, resultRoll) => {
  if (!resultRoll) return errorMessage;

  let outMessage = '';
  resultRoll.rolls.map((item, index, array) => {
    outMessage += item;
    if(index < array.length-1)
      outMessage += ', ';
  })
  return `${userName} rolled ${inputRoll} \nEach result: ${outMessage} \nTotal: ${resultRoll.sum}`;
};

const getInlineDiceList = (messageUsername, messageQuery) => {
  let results = [
    {
      'id': '001' , 'type': 'article', 'title': 'D4', 'description': 'Tetrahedron', 
      'thumb_url': 'https://upload.wikimedia.org/wikipedia/commons/1/19/4-sided_dice_250.jpg', 
      'thumb_width': 163, 'thumb_height': 182,
      'message_text': `${messageUsername} rolled D4: ${calculateInput(parseMessage('D4')).sum}`
    },
    {
      'id': '002' , 'type': 'article', 'title': 'D6', 'description': 'Cube', 
      'thumb_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dice_2005.jpg/238px-Dice_2005.jpg',
      'thumb_width': 238, 'thumb_height': 240,
      'message_text': `${messageUsername} rolled D6: ${calculateInput(parseMessage('D6')).sum}`
    },
    {
      'id': '003' , 'type': 'article', 'title': 'D8', 'description': 'Octahedron',
      'thumb_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/D8_truncated_octahedron.JPG/237px-D8_truncated_octahedron.JPG',
      'thumb_width': 237, 'thumb_height': 240,
      'message_text': `${messageUsername} rolled D8: ${calculateInput(parseMessage('D8')).sum}`
    },
    {
      'id': '004' , 'type': 'article', 'title': 'D10', 'description': 'Pentagonal',
      'thumb_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/10_sided_die.svg/235px-10_sided_die.svg.png',
      'thumb_width': 235, 'thumb_height': 240,
      'message_text': `${messageUsername} rolled D10: ${calculateInput(parseMessage('D10')).sum}`
    },
    {
      'id': '005' , 'type': 'article', 'title': 'D12', 'description': 'Dodecahedron', 
      'thumb_url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/D12_rhombic_dodecahedron.JPG/256px-D12_rhombic_dodecahedron.JPG',
      'thumb_width': 238, 'thumb_height': 240,
      'message_text': `${messageUsername} rolled D12: ${calculateInput(parseMessage('D12')).sum}`
    },
    {
      'id': '006' , 'type': 'article', 'title': 'D20', 'description': 'Icosahedron',
      'thumb_url': 'https://upload.wikimedia.org/wikipedia/commons/9/97/20-sided_dice_250.jpg',
      'thumb_width': 162, 'thumb_height': 153,
      'message_text': `${messageUsername} rolled D20: ${calculateInput(parseMessage('D20')).sum}`
    }
  ];

  if(messageQuery)
    results = results.filter((elem) => 
      elem.title.indexOf(messageQuery.toUpperCase()) > -1
    );
  
  return results;
}

module.exports = {
  parseMessage,
  calculateInput,
  outputMessage,
  errorMessage,
  getInlineDiceList
}