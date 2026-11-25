import { NextRequest } from 'next/server'

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET(request: NextRequest) {
  const course = request.nextUrl.searchParams.get('course') || 'Course Submission'
  const safeCourse = escapeXml(course)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 520" width="760" height="520">
  <rect width="760" height="520" fill="#0B1120"/>
  <rect x="32" y="32" width="696" height="456" rx="16" fill="#121A2E" stroke="#3B82F6" stroke-opacity="0.35"/>
  <rect x="56" y="56" width="168" height="28" rx="14" fill="#2563EB" fill-opacity="0.2" stroke="#3B82F6" stroke-opacity="0.45"/>
  <text x="140" y="74" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#AEC6FF">PORTFOLIO DEMO PDF</text>
  <text x="56" y="128" font-family="sans-serif" font-size="26" font-weight="700" fill="#FFFFFF">${safeCourse}</text>
  <text x="56" y="160" font-family="monospace" font-size="13" fill="#7F97C7">Dourous-Net · Student Lab Submission Preview</text>
  <line x1="56" y1="188" x2="704" y2="188" stroke="#DDE3EC" stroke-opacity="0.12"/>
  <text x="56" y="230" font-family="sans-serif" font-size="15" fill="#DDE3EC">Summary: Complete algorithmic analysis, test benchmarks, and complexity</text>
  <text x="56" y="254" font-family="sans-serif" font-size="15" fill="#DDE3EC">proofs submitted through Dourous-Net Assignment Uploader.</text>
  <rect x="56" y="290" width="648" height="120" rx="12" fill="#080E1D" stroke="#DDE3EC" stroke-opacity="0.12"/>
  <text x="76" y="328" font-family="monospace" font-size="13" fill="#10B981">Status: Ready for instructor review</text>
  <text x="76" y="356" font-family="monospace" font-size="13" fill="#94A3B8">Format: Portfolio sandbox preview (no sensitive student file stored)</text>
  <text x="76" y="384" font-family="monospace" font-size="13" fill="#94A3B8">Security: Simulated private storage path</text>
  <text x="56" y="454" font-family="monospace" font-size="12" fill="#8A94A8">Dourous-Net · Algeria Digital Learning Platform</text>
</svg>`

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
