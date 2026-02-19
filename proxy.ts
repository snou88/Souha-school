import { NextResponse } from 'next/server';

// Exemple de proxy (anciennement middleware)
export default function proxy(request: Request) {
	// Ajoute ici ta logique de filtrage, d'authentification, etc.
	return NextResponse.next();
}
