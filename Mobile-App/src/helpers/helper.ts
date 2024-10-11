export function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}

export function formatTiempo(tiempo: string): string {
    const [horas, minutos, segundos] = tiempo.split(':');

    const tiempoFormateado = [];

    if (parseInt(horas) > 0) {
        tiempoFormateado.push(`${parseInt(horas)}h`);
    }

    if (parseInt(minutos) > 0) {
        tiempoFormateado.push(`${parseInt(minutos)}min`);
    }

    if (parseInt(segundos) > 0) {
        tiempoFormateado.push(`${parseInt(segundos)}seg`);
    }

    return tiempoFormateado.join(' ');
}
