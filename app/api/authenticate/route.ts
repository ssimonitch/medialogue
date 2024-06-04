import { DeepgramError, createClient } from '@deepgram/sdk';
import { NextResponse, type NextRequest } from 'next/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // assumer we're using a long-lived key in development
  if (process.env.DEEPGRAM_ENV === 'development') {
    return NextResponse.json({ key: process.env.DEEPGRAM_API_KEY ?? '' });
  }

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? '');

  let { result: projectsResult, error: projectsError } = await deepgram.manage.getProjects();

  if (projectsError) {
    return NextResponse.json(projectsError);
  }

  const project = projectsResult?.projects[0];

  if (!project) {
    return NextResponse.json(new DeepgramError('Cannot find a Deepgram project. Please create a project first.'));
  }

  let { result: newKeyResult, error: newKeyError } = await deepgram.manage.createProjectKey(project.project_id, {
    comment: 'Temporary API key for Medialogue',
    scopes: ['usage:write'],
    tags: ['medialogue'],
    time_to_live_in_seconds: 60,
  });

  if (newKeyError) {
    return NextResponse.json(newKeyError);
  }

  const response = NextResponse.json({ ...newKeyResult });
  response.headers.set('Cache-Control', 's-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Expires', '0');

  return response;
}
