import { NextResponse } from "next/server";
import { URL } from "url";
import { NextRequest } from "next/server";

// pages/api/star-repo.js
export async function POST(req: NextRequest) {
  const url = new URL(req.url, `http://${req.headers.get("host")}`);
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");

  const token = req.headers.get("authorization")?.split(" ")?.[1];

  console.log(owner, repo, token);

  if (!token || !owner || !repo) {
    return NextResponse.json(
      { message: "Missing Parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.github.com/user/starred/${owner}/${repo}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (response.ok) {
      return NextResponse.json({ message: "Repo starred" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Failed to star the repository" },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
