var async       = require('async');
var Company     = require('./../../db/models/company.js');
var Member      = require('./../../db/models/member.js');
var email       = require('emailjs');
var url_prefix = require('./../../../config').url;
var emailConfig = require('./../../../config').email;

var server = email.server.connect({
  user:     emailConfig.user,
  password: emailConfig.password,
  host:     emailConfig.host,
  ssl:      emailConfig.ssl
});

module.exports = send;

function send(request, reply) {

  var company;
  var member;
  var signature;

  async.series([
    getCompany,
    getMember,
    sendEmail
  ], done);

  function getCompany(cb) {
    Company.findById(request.params.id, gotCompany);

    function gotCompany(err, result) {
      if (err) {
        cb(err);
      }
      else if (result && result.length > 0) {
        company = result[0];
        cb();
      }
      else {
        cb("Could not find company '" + request.params.id + "'.");
      }
    }
  }

  function getMember(cb) {
    Member.findById(company.member, gotMember);

    function gotMember(err, result) {
      if (err) {
        cb(err);
      }
      else if (result && result.length > 0) {
        member = result[0];
        signature = "<table style=\"color: rgb(0, 0, 0); font-family:helvetica,arial;font-size:13px;\"><tbody><tr><td style=\"font-family: arial, sans-serif; margin: 0px;\"><a href=\"http://www.facebook.com/sinfoist\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/facebook.png\" /></a> <br /><a href=\"http://www.twitter.com/sinfo_ist\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/twitter.png\" /></a> <br /><a href=\"http://www.youtube.com/sinfoist\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/youtube.png\" /></a> <br /><a href=\"mailto:geral@sinfo.org\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/email.png\" /></a></td><td style=\"font-family: arial, sans-serif; margin: 0px; padding: 0px 10px;\"><a href=\"http://sinfo.org/\" target=\"_blank\"><img src=\"http://static.sinfo.org/SINFO_21/Assinatura/Logo%20Fundo%20Branco.png\" width=\"125px\" /></a></td><td style=\"font-family: arial, sans-serif; margin: 0px;\"><b>"+member.name+"</b> <br />"+member.roles[0].name+"<br /><a href=\"mailto:"+member.mails.sinfo+"\" target=\"_blank\">"+member.mails.sinfo+"</a> <br />(+351) "+member.phones[0].split(' (')[0]+" </td></tr></tbody></table>";
        cb();
      }
      else {
        cb("Could not find member '" + company.member + "'.");
      }
    }
  }

  function sendEmail(cb){
    var email = request.payload.email;

    var message = {
       text:    "Convite para a participação da "+company.name+" na SINFO 22",
       from:    member.name + "<" +member.mails.sinfo + ">",
       to:      email,
       cc:      member.name + "<" +member.mails.sinfo + ">",
       subject: "[SINFO] Convite para a participação da "+company.name+" na SINFO 22",
       attachment:
       [
          {data:"<html><div style=\"width: 100%;\"><div style=\"margin: 0px auto; text-align: center; overflow: hidden;\"><p style=\"font-size: 40px; font-family: Arial; font-weight: bold; font-style: normal; font-variant: normal; text-decoration: none;\">Convidamos a " + company.name + " a participar na      </p>      <img src=\""+url_prefix+"/sponsor/"+company.id+"/logo.jpg\" alt=\"SINFO 22 - Semana Informática\" />  </div>    <p>      Os alunos do curso de Engenharia de Informática e de Computadores do Instituto Superior Técnico têm todo o prazer       e vêm por este meio convidar a " + company.name + " a participar na 22ª edição da SINFO.  </p>    <p><strong>Quando: Semana de 2ª-feira 9 de Fevereiro a 6ª-feira 13 de Fevereiro de 2015.</strong></p>  <p><strong>Onde: Instituto Superior Técnico, Campus Alameda, em Lisboa.</strong></p>  <p>      Na nossa <a href=\""+url_prefix+"/sponsor/"+company.id+"\">página de apresentação</a> do evento encontra-se      mais informação sobre o evento, assim como sobre as condições de participação no mesmo.  </p>    <p>      Para qualquer questão, não hesite em contactar-me via email ou telefone (ver assinatura do email). Estou       igualmente disponível para uma reunião presencial de esclarecimentos, em horário oportuno.  </p>  <p>      Agradecidos pela atenção prestada e esperando uma resposta favorável, apresentamos os nossos mais cordiais cumprimentos.  </p>  <p>      Pela Comissão Organizadora da SINFO 22,  </p>"+signature+"</html>", alternative:true}
       ],
       "reply-to":member.name + "<" +member.mails.sinfo + ">"
    };

    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function(err, message) {
      if(err) {
        cb(err);
      }
      else {
        console.log(err || message);
        cb();
      }
    });
  }

  function done(err) {
    if (err) {
      reply({error: "There was an error sending the email."});
    } else {
      reply({success: "Email sent."});
    }
  }

}
