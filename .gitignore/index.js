const Discord = require('discord.js')
const bot = new Discord.Client()
var botGame = '-help'
var prefix = '-'
bot.on('ready', function() {
	bot.user.setActivity(botGame)
	bot.user.setStatus('online')
	bot.user.setAvatar('./logo.jpg')
	console.log('Je suis prêt ^^')
})
bot.on('guildMemberAdd', function (member) {
	member.createDM().then(function (channel) 
  {
    channel.send("Bienvenue dans le terrier des createurs, j'espère que tu te plaira, vas tchecker <#444518041867517962>")
  })
	member.guild.channels.find('name', 'bienvenue').send("Message de bienvenue : Hey "+member+" et bienvenue sur LTDN Community, n’oublie pas le <#460891990960111646>")
});
bot.on('guildMemberRemove', function (member) {
	member.createDM().then(function (channel) 
  {
    channel.send("Au revoir dans le terrier des createurs, j'espère que tu t'ai plu !")
  })
	member.guild.channels.find('name', 'bienvenue').send("Byebye "+member+" tu va nous manquer !")
});
bot.on('message', async (message)=>{
if (message.content === prefix + 'help') {
	let help = new Discord.RichEmbed()
	.setTitle('~HELP~')
	.addField('-kick <pseudo> <raison>', 'Sert a kick une personne du serveur.')
	.addField('-ban <pseudo> <raison>', 'Sert a bon définitivement une personne du serveur.')
	.addField('-mute <pseudo>', 'Sert à mute une personne.')
	.addField('-unmute <pseudo>', 'Sert à unmute une personne.')
	.addField('-addrole <pseudo> role', 'Sert à donner un role.')
	.addField('-removerole <pseudo> role', 'Sert à enlever un role.')
	.addField('Créé par DiMz :', 'https://discord.gg/CadY7bD')
	message.channel.send(help)
}
});
const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

bot.on('raw', async event => {
  if (!events.hasOwnProperty(event.t)) return;

  const { d: data } = event;
  const user = bot.users.get(data.user_id);
  const channel = bot.channels.get(data.channel_id) || await user.createDM();

  if (channel.messages.has(data.message_id)) return;

  const message = await channel.fetchMessage(data.message_id);
  const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
  let reaction = message.reactions.get(emojiKey);

  if (!reaction) {
    const emoji = new Discord.Emoji(bot.guilds.get(data.guild_id), data.emoji);
    reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === bot.user.id);
  }

  bot.emit(events[event.t], reaction, user);
});
bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;


  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(cmd === (prefix + 'kick')){


    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Utilisateur non trouvé.");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Je ne peux pas faire ça!");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Cette personne ne peut être kické!")
    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#e56b00")
    .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
    .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Tiime", message.createdAt)
    .addField("Reason", kReason);

    message.guild.member(kUser).kick(kReason);
    message.channel.send(kickEmbed);

    return;
  }

  if(cmd === (prefix + 'ban')){

    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Utilisateur non trouvé.");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("Je ne peux pas faire ça!");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Cette personne ne peut être kické!");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#bc0000")
    .addField("Banned User", `${bUser} with ID ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    message.guild.member(bUser).ban(bReason);
    message.channel.send(banEmbed);


    return;
  }

if(cmd === (prefix + 'addrole')){
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Désolé je ne peux pas faire ça.");
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!rMember) return message.reply("Utilisateur non trouvé.");
    let role = args.join(" ").slice(22);
    if(!role) return message.reply("Specifier le rôle!");
    let gRole = message.guild.roles.find(`name`, role);
    if(!gRole) return message.reply("Rôle non trouvé!");

    if(rMember.roles.has(gRole.id)) return message.reply("Cette utilisateur a déja ce rôle!");
    await(rMember.addRole(gRole.id));

  try{
    await rMember.send(`Félicitations vous avez bien reçu le rôle ${gRole.name}`)
  }catch(e){
    message.channel.send(`Félicitations à <@${rMember.id}>, pour avoir bien reçu le rôle ${gRole.name}.`)
  }
}

module.exports.help = {
  name: "addrole"
}

if(cmd === (prefix + 'removerole')){
  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Désolé je ne peux pas faire ça..");
  let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!rMember) return message.reply("Utilisateur non trouvé.");
  let role = args.join(" ").slice(22);
  if(!role) return message.reply("Specifier un rôle!");
  let gRole = message.guild.roles.find(`name`, role);
  if(!gRole) return message.reply("Rôle non trouvé!");

  if(!rMember.roles.has(gRole.id)) return message.reply("Cette Uilisateur n'a pas ce rôle!");
  await(rMember.removeRole(gRole.id));

  try{
    await rMember.send(`RIP, vous avez perdu le rôle ${gRole.name}.`)
  }catch(e){
    message.channel.send(`RIP à <@${rMember.id}>, qui à perdu le rôle ${gRole.name}.`)
  }
}
if(cmd === prefix + "mute"){

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Vous n'avez pas les droits pour muter un utilisateur !");

    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!toMute) return message.channel.send("Merci d'entrer un utilisateur !");
    let role = message.guild.roles.find(r => r.name === "Muted");
    if(!role){
      try {
        role = await message.guild.createRole({
          name: "Muted",
          color:"#000000",
          permissions:[]
        });

        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(role, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch (e) {
        console.log(e.stack)
      }
    }

    if(toMute.roles.has(role.id)) return message.channel.send('Cet utilisateur est déjà muté !');

    await(toMute.addRole(role));
    message.channel.send("Je l'ai muté !");

    return;
  }
  if (cmd === prefix + 'unmute') {
  	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Vous n'avez pas les droits pour unmuter un utilisateur !");
let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!toMute) return message.channel.send("Merci d'entrer un utilisateur !");
let role = message.guild.roles.find(r => r.name === "Muted");
if (!toMute.roles.has(role.id)) return message.channel.send("Cette personne n'est pas mute !")
	toMute.removeRole(role.id)
message.channel.send("Je l'ai unmuté !")
  }
module.exports.help = {
  name: "removerole"
}
});
bot.on('messageReactionAdd', async (reaction, user)=>{
  // GAME ZAKAYO !!
  if (reaction.message.content.startsWith('[ROLEMENU]')) {
    reaction.message.react('✅')
    reaction.message.react('📎')
    reaction.message.react('👨')
    reaction.message.react('👩')
    if (reaction.emoji.name === '✅') {
      let role = reaction.message.guild.roles.find(`name`, `✅ Membre validé ✅`);
      reaction.message.guild.members.get(user.id).addRole(role.id)
      user.send('Vous avez reçu le role "Membre Validé" sur le serveur ' + reaction.message.guild.name + ' !')
    }
    else if (reaction.emoji.name === '📎') {
      let role = reaction.message.guild.roles.find(`name`, `Pubeur comfirmé`);
      reaction.message.guild.members.get(user.id).addRole(role.id)
      user.send('Vous avez reçu le role "Pubeur comfirmé" sur le serveur ' + reaction.message.guild.name + ' !')
    }
    else if (reaction.emoji.name === '👨') {
      let role = reaction.message.guild.roles.find(`name`, `Homme`);
      reaction.message.guild.members.get(user.id).addRole(role.id)
      user.send('Vous avez reçu le role "Homme" sur le serveur ' + reaction.message.guild.name + ' !')
    }
    else if (reaction.emoji.name === '👩') {
      let role = reaction.message.guild.roles.find(`name`, `Femme`);
      reaction.message.guild.members.get(user.id).addRole(role.id)
      user.send('Vous avez reçu le role "Femme" sur le serveur ' + reaction.message.guild.name + ' !')
    }
    else {
      reaction.remove(user)
    }
  }
});
bot.on('messageReactionRemove', async (reaction, user)=>{
  // GAME ZAKAYO !!
  if (reaction.message.content.startsWith('[ROLEMENU]')) {
    if (reaction.emoji.name === '✅') {
      let role = reaction.message.guild.roles.find(`name`, `✅ Membre validé ✅`);
      reaction.message.guild.members.get(user.id).removeRole(role.id)
      user.send('Vous avez reçu le role "Membre Validé" sur le serveur ' + reaction.message.guild.name + ' !')
    }
    else if (reaction.emoji.name === '📎') {
      let role = reaction.message.guild.roles.find(`name`, `Pubeur comfirmé`);
      reaction.message.guild.members.get(user.id).removeRole(role.id)
      user.send('Vous avez reçu le role "Pubeur comfirmé" sur le serveur ' + reaction.message.guild.name + ' !')
    }
    else if (reaction.emoji.name === '👨') {
      let role = reaction.message.guild.roles.find(`name`, `Homme`);
      reaction.message.guild.members.get(user.id).removeRole(role.id)
      user.send('Vous avez reçu le role "Homme" sur le serveur ' + reaction.message.guild.name + ' !')
    }
    else if (reaction.emoji.name === '👩') {
      let role = reaction.message.guild.roles.find(`name`, `Femme`);
      reaction.message.guild.members.get(user.id).removeRole(role.id)
      user.send('Vous avez reçu le role "Femme" sur le serveur ' + reaction.message.guild.name + ' !')
    }
    else {
      reaction.remove(user)
    }
  }
});
bot.login(process.env.TOKENd)
