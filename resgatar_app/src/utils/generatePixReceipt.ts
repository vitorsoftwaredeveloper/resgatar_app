import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const generateComprovanteHTML = ({
  userName,
  userEmail,
  userCpf,
  month,
  value,
  paidDate,
}: {
  userName: string;
  userEmail: string;
  userCpf?: string;
  month: string;
  value: string;
  paidDate: string;
}) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Helvetica, Arial, sans-serif;
      padding: 40px;
      background-color: #FAFAFA;
      color: #1a1a1a;
    }

    /* Header */
    .header {
      background-color: #2D5A27;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      text-align: center;
    }

    .header-title {
      font-size: 22px;
      font-weight: 700;
      color: white;
      margin-bottom: 4px;
    }

    .header-subtitle {
      font-size: 12px;
      color: #E8E8E8;
    }

    .status-badge {
      background-color: #10B981;
      padding: 8px 16px;
      border-radius: 20px;
      margin-top: 16px;
      display: inline-block;
    }

    .status-text {
      color: white;
      font-size: 11px;
      font-weight: 700;
    }

    /* Card */
    .card {
      background-color: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      border: 1px solid #E5E5E5;
    }

    .card-title {
      font-size: 10px;
      color: #666;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .value-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #F0F0F0;
    }

    .value-row.last {
      border-bottom: none;
    }

    .label {
      font-size: 11px;
      color: #666;
    }

    .value {
      font-size: 11px;
      font-weight: 700;
      color: #1a1a1a;
    }

    /* Total */
    .total-card {
      background-color: #2D5A27;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-label {
      font-size: 14px;
      color: white;
    }

    .total-value {
      font-size: 28px;
      font-weight: 700;
      color: white;
    }

    /* Footer */
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #E5E5E5;
      text-align: center;
    }

    .footer-text {
      font-size: 9px;
      color: #999;
      line-height: 1.4;
    }

    .receipt-number {
      font-size: 10px;
      color: #666;
      margin-top: 8px;
    }
  </style>
</head>

<body>

  <!-- Header -->
  <div class="header">
    <div class="header-title">Comunidade Resgatar</div>
    <div class="header-subtitle">Comprovante de Pagamento</div>
    <div class="status-badge">
      <span class="status-text">✓ PAGAMENTO CONFIRMADO</span>
    </div>
  </div>

  <!-- Dados do Associado -->
  <div class="card">
    <div class="card-title">Dados do Associado</div>

    <div class="value-row">
      <div class="label">Nome</div>
      <div class="value">${userName}</div>
    </div>

    <div class="value-row ${!userCpf ? "last" : ""}">
      <div class="label">E-mail</div>
      <div class="value">${userEmail}</div>
    </div>

    ${
      userCpf
        ? `
      <div class="value-row last">
        <div class="label">CPF</div>
        <div class="value">${userCpf}</div>
      </div>
    `
        : ""
    }
  </div>

  <!-- Detalhes do Pagamento -->
  <div class="card">
    <div class="card-title">Detalhes do Pagamento</div>

    <div class="value-row">
      <div class="label">Referência</div>
      <div class="value">${month}</div>
    </div>

    <div class="value-row">
      <div class="label">Data do Pagamento</div>
      <div class="value">${paidDate}</div>
    </div>

    <div class="value-row">
      <div class="label">Método</div>
      <div class="value">PIX</div>
    </div>

   
  </div>

  <!-- Total -->
  <div class="total-card">
    <div class="total-label">Valor Pago</div>
    <div class="total-value">${value}</div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-text">
      Este documento é um comprovante de pagamento válido.
    </div>
    <div class="footer-text">
      Comunidade Resgatar
    </div>
    <div class="receipt-number">
      Gerado em: ${new Date().toLocaleDateString("pt-BR")} às
      ${new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  </div>

</body>
</html>
`;

export const shareComprovantePDF = async (item: {
  name: string;
  email: string;
  month: string;
  paidAt: string;
  value: string;
  cpf: string;
}) => {
  try {
    const html = generateComprovanteHTML({
      userName: item.name,
      userEmail: item.email,
      month: item.month,
      paidDate: item.paidAt,
      userCpf: item.cpf,
      value: item.value,
    });

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Compartilhar comprovante",
    });
  } catch (error) {
    console.error("Erro ao gerar comprovante:", error);
  }
};
