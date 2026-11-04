using UnityEngine;

namespace SurvivalIO.Enemy
{
    /// <summary>
    /// Handles enemy movement and steering towards the target player.
    /// </summary>
    [RequireComponent(typeof(Rigidbody2D))]
    public class EnemyMovement : MonoBehaviour
    {
        [SerializeField] private Rigidbody2D _rigidbody2D;
        [SerializeField] private float _moveSpeed = 3f;

        private Transform _target;

        public float MoveSpeed
        {
            get => _moveSpeed;
            set => _moveSpeed = Mathf.Max(0.1f, value);
        }

        private void Awake()
        {
            if (_rigidbody2D == null) _rigidbody2D = GetComponent<Rigidbody2D>();
        }

        public void SetTarget(Transform target)
        {
            _target = target;
        }

        private void FixedUpdate()
        {
            if (_target == null) return;

            Vector2 direction = ((Vector2)_target.position - _rigidbody2D.position).normalized;
            _rigidbody2D.linearVelocity = direction * _moveSpeed;

            if (Mathf.Abs(direction.x) > 0.05f)
            {
                Vector3 scale = transform.localScale;
                scale.x = direction.x > 0 ? Mathf.Abs(scale.x) : -Mathf.Abs(scale.x);
                transform.localScale = scale;
            }
        }

        public void StopMovement()
        {
            if (_rigidbody2D != null) _rigidbody2D.linearVelocity = Vector2.zero;
        }
    }
}

