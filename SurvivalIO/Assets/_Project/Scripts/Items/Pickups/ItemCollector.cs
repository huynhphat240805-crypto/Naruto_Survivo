using System;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Items
{
    /// <summary>
    /// Component on the Player that detects nearby ICollectable pickups and applies their benefits.
    /// </summary>
    public class ItemCollector : MonoBehaviour
    {
        [SerializeField] private float _pickupRadius = 2.5f;
        [SerializeField] private LayerMask _collectableLayer;

        private static readonly Collider2D[] _results = new Collider2D[32];

        public float PickupRadius
        {
            get => _pickupRadius;
            set => _pickupRadius = Mathf.Max(0.5f, value);
        }

        public event Action<float> OnExperienceCollected;
        public event Action<float> OnHealthCollected;
        public event Action<int> OnGoldCollected;

        private void Update()
        {
            ScanForCollectables();
        }

        private void ScanForCollectables()
        {
            int count = Physics2D.OverlapCircleNonAlloc(transform.position, _pickupRadius, _results, _collectableLayer);

            for (int i = 0; i < count; i++)
            {
                if (_results[i] != null && _results[i].TryGetComponent<ICollectable>(out var collectable))
                {
                    if (collectable.CanCollect)
                    {
                        collectable.Collect(transform);
                    }
                }
            }
        }

        public void ApplyItemEffect(ItemDataSO data)
        {
            if (data == null) return;

            switch (data.ItemType)
            {
                case ItemType.ExperienceGem:
                    OnExperienceCollected?.Invoke(data.Value);
                    break;

                case ItemType.HealthPotion:
                    OnHealthCollected?.Invoke(data.Value);
                    break;

                case ItemType.GoldCoin:
                    OnGoldCollected?.Invoke(Mathf.RoundToInt(data.Value));
                    break;

                case ItemType.TreasureChest:
                    OnGoldCollected?.Invoke(Mathf.RoundToInt(data.Value * 5));
                    break;

                case ItemType.TemporaryBuff:
                    // Apply temporary stat boost
                    break;
            }
        }

        private void OnDrawGizmosSelected()
        {
            Gizmos.color = Color.yellow;
            Gizmos.DrawWireSphere(transform.position, _pickupRadius);
        }
    }
}

