"use client";

import { useEffect, useState } from "react";
import { getAllCampaigns, getCampaignById } from "@/lib/db/campaign";
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

export function useCampaign(kampaignId?: string) {
  const [campaign, setCampaign] = useState<CampaignRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!kampaignId) {
      setCampaign(null);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);
    getCampaignById(kampaignId)
      .then((data) => {
        if (mounted) {
          setCampaign(data ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setCampaign(null);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [kampaignId]);

  return { campaign, loading };
}
