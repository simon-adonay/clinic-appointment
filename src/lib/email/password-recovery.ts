type PasswordRecoveryEmail = {
  to: string;
  resetUrl: string;
};

export async function sendPasswordRecoveryEmail({ to, resetUrl }: PasswordRecoveryEmail) {
  if (!process.env.EMAIL_FROM) {
    console.info(`[password-recovery] Reset link for ${to}: ${resetUrl}`);
    return;
  }

  console.info(
    `[password-recovery] EMAIL_FROM is configured, but no email provider is wired yet. Reset link for ${to}: ${resetUrl}`
  );
}
