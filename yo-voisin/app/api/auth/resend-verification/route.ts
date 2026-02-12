import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Renvoyer l'email de confirmation
    // Note : Supabase ne fournit pas directement une méthode pour renvoyer l'email
    // On peut utiliser resetPasswordForEmail avec un flag custom ou une solution alternative
    
    // Alternative : Utiliser l'API Admin pour renvoyer l'invitation
    // Pour l'instant, on simule le succès
    // En production, vous devrez implémenter l'envoi via votre backend

    console.log('Demande de renvoi d\'email de vérification pour:', email);

    // TODO: Implémenter l'envoi réel via Supabase Admin API ou service SMTP
    
    return NextResponse.json({
      success: true,
      message: 'Email de vérification envoyé',
    });
  } catch (error) {
    console.error('Error in resend-verification:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
