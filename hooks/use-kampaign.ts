"use client";

import { useEffect, useState } from "react";
import { getAllCampaigns } from "@/lib/db/campaign";
import { CampaignRecord } from "@/lib/db/types";

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getAllCampaigns().then((data) => {
      if (mounted) {
        setCampaigns(data);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { campaigns, loading };
}