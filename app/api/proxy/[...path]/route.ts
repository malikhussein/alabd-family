import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API = "http://77.42.89.236:3000";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const pathSegments = params.path || [];
    const pathname = pathSegments.join("/");
    const searchParams = req.nextUrl.searchParams.toString();
    const url = `${EXTERNAL_API}/${pathname}${searchParams ? "?" + searchParams : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from external API" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const pathSegments = params.path || [];
    const pathname = pathSegments.join("/");
    const searchParams = req.nextUrl.searchParams.toString();
    const url = `${EXTERNAL_API}/${pathname}${searchParams ? "?" + searchParams : ""}`;

    const body = await req.json().catch(() => ({}));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from external API" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const pathSegments = params.path || [];
    const pathname = pathSegments.join("/");
    const searchParams = req.nextUrl.searchParams.toString();
    const url = `${EXTERNAL_API}/${pathname}${searchParams ? "?" + searchParams : ""}`;

    const body = await req.json().catch(() => ({}));

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from external API" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const pathSegments = params.path || [];
    const pathname = pathSegments.join("/");
    const searchParams = req.nextUrl.searchParams.toString();
    const url = `${EXTERNAL_API}/${pathname}${searchParams ? "?" + searchParams : ""}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from external API" },
      { status: 500 },
    );
  }
}
