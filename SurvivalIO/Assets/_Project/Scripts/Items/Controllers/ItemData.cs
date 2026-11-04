using System;
using UnityEngine;

namespace SurvivalIO.Items
{
    public enum ItemType
    {
        ExperienceGem,
        HealthPotion,
        GoldCoin,
        TreasureChest,
        TemporaryBuff,
        MagnetVacuum
    }

    [Serializable]
    public class ItemData
    {
        public string Id;
        public string Name;
        public ItemType Type;
        public float Value;
        public Sprite Icon;
        public GameObject Prefab;
    }
}

