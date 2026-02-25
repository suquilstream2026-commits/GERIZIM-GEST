
import { User, ChurchEvent } from './types';

/**
 * Serviço simulado de e-mail para a plataforma IESA-GEST.
 * Em um ambiente real, isto conectaria a um servidor SMTP ou API de e-mail (SendGrid, Mailgun, etc).
 */

export const emailService = {
  /**
   * Envia e-mail de boas-vindas para um novo utilizador.
   */
  async sendWelcomeEmail(user: User): Promise<boolean> {
    console.log(`[EMAIL SIMULATED] Enviando boas-vindas para: ${user.name}`);
    console.log(`Assunto: Bem-vindo à IESA GERIZIM - GEST`);
    console.log(`Corpo: Olá ${user.name}, sua conta de ${user.role} foi criada com sucesso no portal da nossa igreja.`);
    
    // Simula latência de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  },

  /**
   * Envia aviso de atividade próxima aos membros.
   */
  async sendActivityReminder(memberEmail: string, event: ChurchEvent): Promise<boolean> {
    console.log(`[EMAIL SIMULATED] Enviando lembrete de atividade para: ${memberEmail}`);
    console.log(`Assunto: LEMBRETE: ${event.title}`);
    console.log(`Corpo: Não se esqueça da nossa atividade de ${event.title} em ${event.date} às ${event.time} em ${event.location}. Esperamos por si!`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  },

  /**
   * Simula o envio de e-mail para redefinição de senha.
   */
  async sendPasswordResetEmail(username: string): Promise<boolean> {
    console.log(`[EMAIL SIMULATED] Instruções de redefinição enviadas para o usuário: ${username}`);
    console.log(`Assunto: Redefinição de Senha - IESA-GEST`);
    console.log(`Corpo: Recebemos um pedido de redefinição para a conta ${username}. Siga as instruções anexas.`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }
};
