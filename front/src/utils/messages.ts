export const getMessage = (msg_id: string | number): string => {
    const messages = {
        "FLOWS_REQUEST_ALREADY_EXISTS": "Мы уже получили твою заявку! Пожалуйста, дождись рассмотрения! и прочитай инструкцию, на всякий случай.",
        "WORKING": "В работе",
        "ON_REVIEW": "На проверке",
        "APPROVED": "Согласовано",
        "DEFENDED": "Защищено",
        "DECLINED": "Отклонено"
    };

    // @ts-expect-error need
    return messages[msg_id] || msg_id;
};